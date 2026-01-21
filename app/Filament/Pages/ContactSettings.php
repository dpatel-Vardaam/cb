<?php

namespace App\Filament\Pages;

use App\Settings\ContactSettings as ContactSettingsData;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Schema;

class ContactSettings extends Page implements Forms\Contracts\HasForms
{
    use Forms\Concerns\InteractsWithForms;

    protected static string|\UnitEnum|null $navigationGroup = 'Settings';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?int $navigationSort = 999;

    protected string $view = 'filament-panels::pages.page';

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $contactSettings = app(ContactSettingsData::class);

        $this->form->fill([
            'email' => $contactSettings->email,
            'phone' => $contactSettings->phone,
        ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Forms\Components\TextInput::make('email')
                ->label('Contact Email')
                ->email()
                ->required(),

            Forms\Components\TextInput::make('phone')
                ->label('Contact Phone')
                ->required(),
        ])->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $contactSettings = app(ContactSettingsData::class);
        $contactSettings->fill($data)->save();

        Notification::make()
            ->title('Contact settings updated.')
            ->success()
            ->send();
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([EmbeddedSchema::make('form')])
                    ->id('contactSettingsForm')
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make([
                            Action::make('save')
                                ->label('Save')
                                ->submit('save'),
                        ]),
                    ]),
            ]);
    }
}
