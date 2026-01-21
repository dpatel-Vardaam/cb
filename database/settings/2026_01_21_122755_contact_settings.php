<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('contact.email', 'admin@example.com');
        $this->migrator->add('contact.phone', '+1 123 456 7890');
    }
};
