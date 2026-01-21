<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ListingResource\Pages;
use App\Models\Listing;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ListingResource extends Resource
{
    protected static ?string $model = Listing::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static string|\UnitEnum|null $navigationGroup = 'Listings';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Photos')
                    ->schema([
                        FileUpload::make('images')
                            ->label('Upload images (first is cover)')
                            ->multiple()
                            ->reorderable()
                            ->maxFiles(10)
                            ->image()
                            ->disk('public')
                            ->directory(fn (?Listing $record) => $record ? 'listings/'.$record->uuid : 'listings')
                            ->visibility('public')
                            ->imageEditor()
                            ->formatStateUsing(function ($state, ?Listing $record) {
                                if ($record && is_array($state)) {
                                    return array_map(
                                        fn ($file) => str_starts_with($file, 'listings/') ? $file : 'listings/'.$record->uuid.'/'.ltrim($file, '/'),
                                        $state,
                                    );
                                }

                                return $state;
                            })
                            ->dehydrateStateUsing(function ($state) {
                                if (is_array($state)) {
                                    return array_map(fn ($path) => basename($path), $state);
                                }

                                return $state;
                            })
                            ->getUploadedFileNameForStorageUsing(fn ($file) => Str::uuid().'.'.$file->getClientOriginalExtension())
                            ->columnSpanFull(),
                    ])
                    ->columns(1),

                Section::make('Basic Information')
                    ->schema([
                        TextInput::make('title')
                            ->label('Title')
                            ->required()
                            ->maxLength(255)
                            ->helperText('e.g., Pastel Clown Ball Python – 2024 Male')
                            ->columnSpan(2),

                        Select::make('user_id')
                            ->label('User')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->columnSpan(1),

                        Select::make('category_id')
                            ->label('Category')
                            ->relationship('category', 'title')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->columnSpan(1),

                        Select::make('species_id')
                            ->label('Species')
                            ->relationship('species', 'title')
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->columnSpan(2),

                        TextInput::make('price')
                            ->label('Price')
                            ->numeric()
                            ->required()
                            ->prefix('$')
                            ->columnSpan(1),

                        TextInput::make('state')
                            ->label('State')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(1),

                        TextInput::make('city')
                            ->label('City')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(1),

                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'active' => 'Active',
                                'sold' => 'Sold',
                                'pending' => 'Pending',
                                'draft' => 'Draft',
                            ])
                            ->required()
                            ->columnSpan(2),

                        Textarea::make('description')
                            ->label('Description')
                            ->rows(4)
                            ->helperText('Include feeding habits, temperament, genetics, etc.')
                            ->columnSpan(2),

                        Toggle::make('is_negotiable')
                            ->label('Negotiable')
                            ->columnSpan(1),

                        Toggle::make('is_delivery_available')
                            ->label('Delivery Available')
                            ->columnSpan(1),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->sortable()->searchable(),
                TextColumn::make('user.name')->label('User')->sortable()->searchable(),
                TextColumn::make('category.title')->label('Category')->sortable()->searchable(),
                TextColumn::make('price')->money('USD', true)->sortable(),
                TextColumn::make('state')->sortable()->searchable(),
                TextColumn::make('city')->sortable()->searchable(),
                IconColumn::make('is_negotiable')->label('Negotiable')->boolean(),
                IconColumn::make('is_delivery_available')->label('Delivery')->boolean(),
                TextColumn::make('status')->sortable()->badge(),
                TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('category')->relationship('category', 'title'),
                SelectFilter::make('user')->relationship('user', 'name')->searchable()->preload(),
                TernaryFilter::make('is_negotiable')->label('Negotiable')->native(false),
                TernaryFilter::make('is_delivery_available')->label('Delivery')->native(false),
                SelectFilter::make('status')->options([
                    'active' => 'Active',
                    'sold' => 'Sold',
                    'pending' => 'Pending',
                    'draft' => 'Draft',
                ]),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListListings::route('/'),
            'create' => Pages\CreateListing::route('/create'),
            'edit' => Pages\EditListing::route('/{record}/edit'),
        ];
    }
}
