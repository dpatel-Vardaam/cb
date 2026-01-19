<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Laravel\Fortify\Features;

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

        $listings = \App\Models\Listing::with(['user', 'category'])
            ->where('status', 'active')
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('home', [
            'canRegister' => Features::enabled(Features::registration()),
            'categories' => $categories,
            'listings' => $listings,
        ]);
    }
}
