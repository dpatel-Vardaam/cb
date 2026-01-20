<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Listing;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-sitemap';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate sitemap.xml for public listings and categories';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sitemap = Sitemap::create()
            ->add(
                Url::create(url('/'))
                    ->setPriority(1.0)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            )
            ->add(
                Url::create(route('listings.index'))
                    ->setPriority(0.8)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            );

        Category::query()
            ->where('is_active', true)
            ->get()
            ->each(function (Category $category) use ($sitemap): void {
                $sitemap->add(
                    Url::create(route('categories.show', $category))
                        ->setLastModificationDate($category->updated_at)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                        ->setPriority(0.6)
                );
            });

        Listing::query()
            ->with('category')
            ->where('status', 'active')
            ->get()
            ->each(function (Listing $listing) use ($sitemap): void {
                $sitemap->add(
                    Url::create(url($listing->seo_url))
                        ->setLastModificationDate($listing->updated_at)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                        ->setPriority(0.7)
                );
            });

        $path = public_path('sitemap.xml');
        $sitemap->writeToFile($path);

        $this->info("Sitemap generated: {$path}");

        return self::SUCCESS;
    }
}
