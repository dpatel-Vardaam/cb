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
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Search query (optional)
        $searchQuery = $request->input('q', '');

        // Default filters
        $filters = [];

        // Mine / Marketplace logic
        if ($request->boolean('mine') && $request->user()) {
            $filters[] = "user_id = {$request->user()->id}";
        } else {
            $filters[] = 'status = active';
        }

        // Filters
        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $filters[] = "category_id = {$request->category_id}";
        }

        if ($request->filled('location')) {
            // NOTE: MeiliSearch does not support LIKE
            // You can use exact match or implement searchable location
            $filters[] = "location = \"{$request->location}\"";
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

        // Scout MeiliSearch query
        $query = Listing::search($searchQuery);

        if (! empty($filters)) {
            $query->options([
                'filter' => implode(' AND ', $filters),
            ]);
        }

        // Paginate results
        $listings = $query->paginate(12);

        $categories = Category::orderBy('title', 'asc')->get(['id', 'title']);

        return Inertia::render('listing/Index', [
            'listings' => $listings,
            'filters' => $request->only([
                'q',
                'category_id',
                'location',
                'min_price',
                'max_price',
                'negotiable',
                'delivery',
                'mine',
            ]),
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::get(['id', 'title']);

        return Inertia::render('listing/CreateListing', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        // Generate UUID for the listing
        $uuid = Str::uuid()->toString();

        // Handle image uploads
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
        // Create the listing
        $listing = Listing::create([
            'id' => $uuid,
            'user_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'location' => $validated['location'],
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

        return redirect()->route('listings.show', $listing)
            ->with('success', 'Your listing has been published successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing)
    {
        $listing->load(['category', 'user']);

        return Inertia::render('listing/Show', [
            'listing' => $listing->append('image_urls'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Listing $listing)
    {
        // Check if user owns this listing
        if ($listing->user_id !== Auth::id()) {
            abort(403, 'You are not authorized to edit this listing.');
        }

        $categories = Category::get(['id', 'title']);

        return Inertia::render('listing/Edit', [
            'listing' => $listing,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Listing $listing)
    {
        // Check if user owns this listing
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
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        // Handle new image uploads if any
        if ($request->hasFile('images')) {
            $storagePath = 'listings/'.$listing->id;
            $imageNames = $listing->images ?? [];

            foreach ($request->file('images') as $image) {
                $filename = Str::uuid().'.'.$image->getClientOriginalExtension();
                $image->storeAs($storagePath, $filename, 'public');
                $imageNames[] = $filename;
            }

            $validated['images'] = array_slice($imageNames, 0, 10); // Keep max 10 images
        }

        $listing->update(array_merge($validated, [
            'images' => $validated['images'] ?? $listing->images,
            'is_negotiable' => $validated['is_negotiable'] ?? false,
            'is_delivery_available' => $validated['is_delivery_available'] ?? false,
        ]));

        return redirect()->route('listings.show', $listing)
            ->with('success', 'Your listing has been updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listing $listing)
    {
        // Check if user owns this listing
        if ($listing->user_id !== Auth::id()) {
            abort(403, 'You are not authorized to delete this listing.');
        }

        // Delete images from storage
        if (! empty($listing->images)) {
            $storagePath = 'listings/'.$listing->id;
            Storage::disk('public')->deleteDirectory($storagePath);
        }

        $listing->delete();

        return redirect()->route('listings.index')
            ->with('success', 'Your listing has been deleted successfully!');
    }
}
