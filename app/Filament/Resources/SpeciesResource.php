<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SpeciesResource\Pages;
use App\Models\Species;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SpeciesResource extends Resource
{
    protected static ?string $model = Species::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-tag';

    protected static string|\UnitEnum|null $navigationGroup = 'Listings';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Species')
                    ->schema([
                        Select::make('category_id')
                            ->label('Category')
                            ->relationship('category', 'title')
                            ->searchable()
                            ->preload()
                            ->required(),

                        TextInput::make('title')
                            ->label('Title')
                            ->required()
                            ->maxLength(255),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->sortable()->searchable(),
                TextColumn::make('category.title')->label('Category')->sortable()->searchable(),
                TextColumn::make('created_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('title')
            ->filters([
                SelectFilter::make('category')->relationship('category', 'title'),
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
            'index' => Pages\ListSpecies::route('/'),
            'create' => Pages\CreateSpecies::route('/create'),
            'edit' => Pages\EditSpecies::route('/{record}/edit'),
        ];
    }
}
