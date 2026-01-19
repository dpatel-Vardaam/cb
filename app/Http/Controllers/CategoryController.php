<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display listings for a specific category.
     */
    public function show(Category $category)
    {
        $listings = Listing::with(['user'])
            ->where('category_id', $category->id)
            ->where('status', 'active')
            ->latest()
            ->paginate(12);

        return Inertia::render('category/Show', [
            'category' => $category,
            'listings' => $listings,
        ]);
    }
}
