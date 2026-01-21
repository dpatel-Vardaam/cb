<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ListingController extends Controller
{
    // ... index() and create() methods remain the same ...
    public function index(Request $request)
    {
        // ... (Your existing index logic is fine) ...
        $searchQuery = $request->input('q', '');
        $filters = [];

        if ($request->boolean('mine') && $request->user()) {
            $filters[] = "user_id = {$request->user()->id}";
        } else {
            $filters[] = 'status = active';
            // NEW: Exclude the current user's listings from the marketplace
            if ($request->user()) {
                $filters[] = "user_id != '{$request->user()->id}'";
            }
        }

        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $filters[] = "category_id = {$request->category_id}";
        }
        if ($request->filled('location')) {
            $filters[] = "location = \"{$request->location}\"";
        }
        if ($request->filled('state')) {
            $filters[] = "state = \"{$request->state}\"";
        }
        if ($request->filled('city')) {
            $filters[] = "city = \"{$request->city}\"";
        }
        if ($request->filled('min_price') && is_numeric($request->min_price)) {
            $filters[] = "price >= {$request->min_price}";
        }
        if ($request->filled('max_price') && is_numeric($request->max_price)) {
            $filters[] = "price <= {$request->max_price}";
        }
        if ($request->boolean('negotiable')) {
            $filters[] = 'is_negotiable = true';
        }
        if ($request->boolean('delivery')) {
            $filters[] = 'is_delivery_available = true';
        }

        $query = Listing::search($searchQuery)->query(fn ($eloquent) => $eloquent->with('category'));

        if (! empty($filters)) {
            $query->options([
                'filter' => implode(' AND ', $filters),
            ]);
        }
        $listings = $query->paginate(12);
        $categories = Category::orderBy('title', 'asc')->get(['id', 'title']);
        $hasListings = $request->user() 
        ? $request->user()->listings()->exists() 
        : false;

        return Inertia::render('listing/Index', [
            'listings' => $listings,
            'filters' => $request->only([
                'q', 'category_id', 'location', 'state', 'city',
                'min_price', 'max_price', 'negotiable', 'delivery', 'mine',
            ]),
            'categories' => $categories,
            'hasListings' => $hasListings,
        ]);
    }

    public function create()
    {
        $categories = Category::get(['id', 'title']);

        return Inertia::render('listing/CreateListing', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        // dd($request);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string|max:5000',
            'price' => 'required|numeric|min:0|max:9999999.99',
            'state' => 'nullable|string|max:255', // Make sure frontend sends this!
            'city' => 'nullable|string|max:255',  // Make sure frontend sends this!
            'species' => 'nullable|string|max:255',
            'morph' => 'nullable|string|max:255',
            'age' => 'nullable|string|max:100',
            'sex' => 'nullable|in:male,female,unknown',
            'is_negotiable' => 'nullable|boolean',
            'is_delivery_available' => 'nullable|boolean',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:15000',
        ]);

        $uuid = Str::uuid()->toString();

        $imageNames = [];
        if ($request->hasFile('images')) {
            $storagePath = 'listings/'.$uuid;
            foreach ($request->file('images') as $image) {
                $filename = Str::uuid().'.'.$image->getClientOriginalExtension();
                $image->storeAs($storagePath, $filename, 'public');
                $imageNames[] = $filename;
            }
        }
        // dd($validated);
        $listing = Listing::create([
            'id' => $uuid,
            'user_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'state' => $validated['state'] ?? null,
            'city' => $validated['city'] ?? null,
            'species' => $validated['species'] ?? null,
            'morph' => $validated['morph'] ?? null,
            'age' => $validated['age'] ?? null,
            'sex' => $validated['sex'] ?? 'unknown',
            'images' => $imageNames,
            'is_negotiable' => $validated['is_negotiable'] ?? false,
            'is_delivery_available' => $validated['is_delivery_available'] ?? false,
            'status' => 'active',
        ]);

        // dd($listing->seo_url);
        // 🔥 FIX: Load relationship so getSeoUrlAttribute works
        $listing->refresh()->load('category');

        // 🔥 FIX: Redirect using the SEO URL accessor
        return redirect($listing->seo_url)
            ->with('success', 'Your listing has been published successfully!');
    }

    public function show(string $state, string $city, string $category, Listing $listing)
    {
        $listing->load(['category', 'user']);

        // SEO Canonical Check
        $correctState = Str::slug($listing->state ?? 'unknown-state');
        $correctCity = Str::slug($listing->city ?? 'unknown-city');
        $correctCategory = $listing->category?->slug
            ?: ($listing->category ? Str::slug($listing->category->title) : 'reptiles');

        if ($state !== $correctState || $city !== $correctCity || $category !== $correctCategory) {
            return redirect()->to($listing->seo_url, 301);
        }

        return Inertia::render('listing/Show', [
            'listing' => $listing->append('image_urls'),
            'seo' => [
                'title' => "{$listing->title} for sale in {$listing->city}, {$listing->state}",
                'description' => Str::limit($listing->description, 160),
            ],
        ]);
    }

    public function edit(Listing $listing)
    {
        if ($listing->user_id !== Auth::id()) {
            abort(403, 'You are not authorized to edit this listing.');
        }

        $categories = Category::get(['id', 'title']);

        return Inertia::render('listing/Edit', [
            'listing' => $listing,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Listing $listing)
    {
        if ($listing->user_id !== Auth::id()) {
            abort(403, 'You are not authorized to update this listing.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string|max:5000',
            'price' => 'required|numeric|min:0|max:9999999.99',
            'location' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'species' => 'nullable|string|max:255',
            'morph' => 'nullable|string|max:255',
            'age' => 'nullable|string|max:100',
            'sex' => 'nullable|in:male,female,unknown',
            'is_negotiable' => 'nullable|boolean',
            'is_delivery_available' => 'nullable|boolean',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:15000',
        ]);

        if ($request->hasFile('images')) {
            $storagePath = 'listings/'.$listing->id;
            $imageNames = $listing->images ?? [];

            foreach ($request->file('images') as $image) {
                $filename = Str::uuid().'.'.$image->getClientOriginalExtension();
                $image->storeAs($storagePath, $filename, 'public');
                $imageNames[] = $filename;
            }

            $validated['images'] = array_slice($imageNames, 0, 10);
        }

        $listing->fill($validated);
        $listing->images = $validated['images'] ?? $listing->images;
        $listing->is_negotiable = $validated['is_negotiable'] ?? false;
        $listing->is_delivery_available = $validated['is_delivery_available'] ?? false;
        $listing->save();

        // 🔥 FIX: Load relationship again in case category changed
        $listing->refresh()->load('category');

        // 🔥 FIX: Redirect using SEO URL
        return redirect($listing->seo_url)
            ->with('success', 'Your listing has been updated successfully!');
    }

    // ... destroy() method remains the same ...
    public function destroy(Listing $listing)
    {
        if ($listing->user_id !== Auth::id()) {
            abort(403, 'You are not authorized to delete this listing.');
        }

        if (! empty($listing->images)) {
            $storagePath = 'listings/'.$listing->id;
            Storage::disk('public')->deleteDirectory($storagePath);
        }

        Listing::destroy($listing->getKey());

        return redirect()->route('listings.index')
            ->with('success', 'Your listing has been deleted successfully!');
    }
}
