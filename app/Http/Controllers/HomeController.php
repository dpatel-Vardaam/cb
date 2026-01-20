<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Listing;
use App\Models\Category;
use Illuminate\Http\Request;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function __invoke(Request $request)
    {
        $categories = Category::query()
            ->active()
            ->ordered()
            ->get()
            ->map(fn($category) => [
                'id' => $category->id,
                'title' => $category->title,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
                'image' => $category->image ? Storage::url($category->image) : null,
            ]);

        $listings = Listing::with(['user', 'category'])
            ->where('status', 'active')
            ->latest()
            ->take(4)
            ->get();

        // Check if authenticated user has any listings
        $userHasListings = false;
        if ($request->user()) {
            $userHasListings = Listing::where('user_id', $request->user()->id)->exists();
        }

        return Inertia::render('home', [
            'canRegister' => Features::enabled(Features::registration()),
            'categories' => $categories,
            'listings' => $listings,
            'userHasListings' => $userHasListings,
        ]);
    }
}
