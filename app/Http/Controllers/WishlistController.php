<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $listings = Wishlist::query()
            ->where('user_id', (string) $request->user()->id)
            ->with(['listing.category'])
            ->latest()
            ->get()
            ->pluck('listing')
            ->filter()
            ->values();

        return Inertia::render('wishlist/index', [
            'listings' => $listings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'listing_id' => ['required', 'uuid', 'exists:listings,id'],
        ]);

        $wishlist = Wishlist::withTrashed()->firstOrCreate([
            'user_id' => (string) $request->user()->id,
            'listing_id' => (string) $data['listing_id'],
        ]);

        if ($wishlist->trashed()) {
            $wishlist->restore();
        }

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Wishlist $wishlist)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Wishlist $wishlist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Wishlist $wishlist)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $wishlist)
    {
        $userId = (string) request()->user()->id;

        Wishlist::query()
            ->where('user_id', $userId)
            ->where(function ($query) use ($wishlist) {
                $query->where('id', $wishlist)
                    ->orWhere('listing_id', $wishlist);
            })
            ->get()
            ->each->delete();

        return back();
    }
}
