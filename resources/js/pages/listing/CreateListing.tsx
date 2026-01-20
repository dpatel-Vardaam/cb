import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ImagePlus,
    Info,
    Loader2,
    MapPin,
    Sparkles,
    Upload,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactSelect, { SingleValue, StylesConfig } from 'react-select';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select as UiSelect,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { home } from '@/routes';

type Category = {
    id: number;
    title: string;
};

type CreateListingProps = {
    categories: Category[];
};

type FormData = {
    title: string;
    category_id: string;
    description: string;
    price: string;
    location: string;
    species: string;
    morph: string;
    age: string;
    sex: string;
    is_negotiable: boolean;
    is_delivery_available: boolean;
    images: File[];
    state: string;
    city: string;
};

type Option = { label: string; value: string };

export default function CreateListing({ categories }: CreateListingProps) {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [states, setStates] = useState<Option[]>([]);
    const [cities, setCities] = useState<Option[]>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [stateError, setStateError] = useState<string | null>(null);
    const [cityError, setCityError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, progress } =
        useForm<FormData>({
            title: '',
            category_id: '',
            description: '',
            price: '',
            location: '',
            species: '',
            morph: '',
            age: '',
            sex: 'unknown',
            is_negotiable: false,
            is_delivery_available: false,
            images: [],
            state: '',
            city: '',
        });

    // Compose location from city/state for the backend field expected
    useEffect(() => {
        if (data.state || data.city) {
            const composed = [data.city, data.state].filter(Boolean).join(', ');
            setData('location', composed);
        }
    }, [data.state, data.city, setData]);

    // Fetch US states once
    useEffect(() => {
        const fetchStates = async () => {
            try {
                setIsLoadingStates(true);
                setStateError(null);
                const res = await fetch(
                    'https://countriesnow.space/api/v0.1/countries/states',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ country: 'United States' }),
                    },
                );

                const json = await res.json();
                if (json?.data?.states) {
                    setStates(
                        json.data.states.map((s: any) => ({
                            label: s.name,
                            value: s.name,
                        })),
                    );
                } else {
                    setStateError('Unable to load states');
                }
            } catch (error) {
                setStateError('Unable to load states');
            } finally {
                setIsLoadingStates(false);
            }
        };

        fetchStates();
    }, []);

    const selectedState = data.state;

    // Fetch cities when state changes
    useEffect(() => {
        if (!selectedState) {
            setCities([]);
            return;
        }

        const fetchCities = async () => {
            try {
                setIsLoadingCities(true);
                setCityError(null);
                const res = await fetch(
                    'https://countriesnow.space/api/v0.1/countries/state/cities',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            country: 'United States',
                            state: selectedState,
                        }),
                    },
                );

                const json = await res.json();
                if (json?.data) {
                    setCities(
                        (json.data as string[]).map((c: string) => ({
                            label: c,
                            value: c,
                        })),
                    );
                } else {
                    setCityError('Unable to load cities');
                }
            } catch (error) {
                setCityError('Unable to load cities');
            } finally {
                setIsLoadingCities(false);
            }
        };

        fetchCities();
    }, [selectedState]);

    const composedLocation = useMemo(
        () => [data.city, data.state].filter(Boolean).join(', '),
        [data.city, data.state],
    );

    const selectStyles: StylesConfig<Option, false> = {
        control: (base: any) => ({
            ...base,
            backgroundColor: '#1a1a24',
            borderColor: 'rgba(255,255,255,0.1)',
            minHeight: '48px',
            color: 'white',
            cursor: 'pointer',
            zIndex: 50,
        }),
        singleValue: (base: any) => ({
            ...base,
            color: 'white',
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: '#1a1a24',
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused
                ? 'rgba(16,185,129,0.2)'
                : 'transparent',
            color: 'white',
        }),
        placeholder: (base: any) => ({
            ...base,
            color: 'rgba(255,255,255,0.5)',
        }),
        input: (base: any) => ({
            ...base,
            color: 'white',
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999, // 🔥 critical
        }),
    };

    const handleImageChange = useCallback(
        (files: FileList | null) => {
            if (!files) return;

            const newFiles = Array.from(files).filter((file) =>
                file.type.startsWith('image/'),
            );

            if (newFiles.length === 0) return;

            // Limit to 10 images
            const totalImages = data.images.length + newFiles.length;
            const filesToAdd =
                totalImages > 10
                    ? newFiles.slice(0, 10 - data.images.length)
                    : newFiles;

            // Create previews
            filesToAdd.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews((prev) => [
                        ...prev,
                        reader.result as string,
                    ]);
                };
                reader.readAsDataURL(file);
            });

            setData('images', [...data.images, ...filesToAdd]);
        },
        [data.images, setData],
    );

    const removeImage = useCallback(
        (index: number) => {
            setData(
                'images',
                data.images.filter((_, i) => i !== index),
            );
            setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        },
        [data.images, setData],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            handleImageChange(e.dataTransfer.files);
        },
        [handleImageChange],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/listings', {
            forceFormData: true,
        });
    };

    return (
        <div className="dark min-h-screen bg-[#0a0a0f] text-white">
            <Head title="Create Listing - Snake Market" />

            {/* Background Effects */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0f] via-[#0d0d14] to-[#0a0a0f]" />
                <div className="absolute -top-40 left-1/4 h-150 w-150 animate-pulse rounded-full bg-emerald-500/8 blur-[150px]" />
                <div
                    className="absolute top-1/3 -right-20 h-125 w-125 rounded-full bg-violet-500/8 blur-[150px]"
                    style={{ animation: 'pulse 4s ease-in-out infinite' }}
                />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-2xl">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={home()}
                            className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 to-cyan-400">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-semibold">New Listing</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Page Title */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white md:text-4xl">
                            Create Your Listing
                        </h1>
                        <p className="mt-2 text-zinc-400">
                            Share your reptile with thousands of enthusiasts
                        </p>
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold text-white">
                                Photos
                            </Label>
                            <span className="text-sm text-zinc-500">
                                {data.images.length}/10 images
                            </span>
                        </div>

                        <div
                            className={`relative rounded-2xl border-2 border-dashed transition-all ${
                                isDragging
                                    ? 'border-emerald-500 bg-emerald-500/10'
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            {imagePreviews.length > 0 ? (
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-square overflow-hidden rounded-xl"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                {index === 0 && (
                                                    <div className="absolute bottom-2 left-2 rounded-full bg-emerald-500/90 px-2 py-1 text-xs font-medium text-white">
                                                        Cover
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {data.images.length < 10 && (
                                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10">
                                                <ImagePlus className="mb-2 h-8 w-8 text-zinc-500" />
                                                <span className="text-sm text-zinc-500">
                                                    Add more
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleImageChange(
                                                            e.target.files,
                                                        )
                                                    }
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center py-16">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                                        <Upload className="h-8 w-8 text-emerald-400" />
                                    </div>
                                    <p className="mb-2 text-lg font-medium text-white">
                                        Drop images here or click to upload
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        PNG, JPG up to 10 images (first image is
                                        cover)
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) =>
                                            handleImageChange(e.target.files)
                                        }
                                    />
                                </label>
                            )}
                        </div>

                        {errors.images && (
                            <p className="text-sm text-red-400">
                                {errors.images}
                            </p>
                        )}

                        {progress && (
                            <div className="rounded-lg bg-white/5 p-4">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">
                                        Uploading images...
                                    </span>
                                    <span className="text-emerald-400">
                                        {progress.percentage}%
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 transition-all"
                                        style={{
                                            width: `${progress.percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-white">
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Title{' '}
                                    <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Pastel Clown Ball Python - 2024 Male"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-400">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Category{' '}
                                        <span className="text-red-400">*</span>
                                    </Label>
                                    <UiSelect
                                        value={data.category_id}
                                        onValueChange={(value) =>
                                            setData('category_id', value)
                                        }
                                    >
                                        <SelectTrigger className="h-12 cursor-pointer border-white/10 bg-white/5 text-white">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent className="border-white/10 bg-[#1a1a24] text-white">
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                    className="focus:bg-emerald-500/20"
                                                >
                                                    {category.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </UiSelect>
                                    {errors.category_id && (
                                        <p className="text-sm text-red-400">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">
                                        Price (₹){' '}
                                        <span className="text-red-400">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="e.g., 45000"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-red-400">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description{' '}
                                    <span className="text-red-400">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your reptile - include feeding habits, temperament, genetics, etc."
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-400">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label>
                                    Location (USA){' '}
                                    <span className="text-red-400">*</span>
                                </Label>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-zinc-400 uppercase">
                                            State
                                        </Label>
                                        <ReactSelect
                                            isClearable
                                            isLoading={isLoadingStates}
                                            options={states}
                                            value={
                                                states.find(
                                                    (s) =>
                                                        s.value === data.state,
                                                ) ?? null
                                            }
                                            onChange={(
                                                option: SingleValue<Option>,
                                            ) => {
                                                setData(
                                                    'state',
                                                    option?.value || '',
                                                );
                                                setData('city', '');
                                            }}
                                            styles={selectStyles}
                                            placeholder={
                                                isLoadingStates
                                                    ? 'Loading states...'
                                                    : 'Select state'
                                            }
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                        />
                                        {stateError && (
                                            <p className="text-sm text-red-400">
                                                {stateError}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs text-zinc-400 uppercase">
                                            City
                                        </Label>
                                        <ReactSelect
                                            isClearable
                                            isDisabled={
                                                !data.state || isLoadingCities
                                            }
                                            isLoading={isLoadingCities}
                                            options={cities}
                                            value={
                                                cities.find(
                                                    (c) =>
                                                        c.value === data.city,
                                                ) ?? null
                                            }
                                            onChange={(
                                                option: SingleValue<Option>,
                                            ) =>
                                                setData(
                                                    'city',
                                                    option?.value || '',
                                                )
                                            }
                                            styles={selectStyles}
                                            placeholder={
                                                !data.state
                                                    ? 'Select state first'
                                                    : isLoadingCities
                                                      ? 'Loading cities...'
                                                      : 'Select city'
                                            }
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                        />
                                        {cityError && (
                                            <p className="text-sm text-red-400">
                                                {cityError}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                                    <Input
                                        readOnly
                                        value={composedLocation}
                                        placeholder="City, State"
                                        className="h-12 border-white/10 bg-white/5 pl-12 text-white placeholder:text-zinc-500"
                                    />
                                </div>
                                {errors.location && (
                                    <p className="text-sm text-red-400">
                                        {errors.location}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Animal Details */}
                    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-white">
                            Animal Details
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="species">Species</Label>
                                <Input
                                    id="species"
                                    placeholder="e.g., Ball Python"
                                    value={data.species}
                                    onChange={(e) =>
                                        setData('species', e.target.value)
                                    }
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="morph">Morph/Genetics</Label>
                                <Input
                                    id="morph"
                                    placeholder="e.g., Pastel Clown het Pied"
                                    value={data.morph}
                                    onChange={(e) =>
                                        setData('morph', e.target.value)
                                    }
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    placeholder="e.g., 6 months, 2 years"
                                    value={data.age}
                                    onChange={(e) =>
                                        setData('age', e.target.value)
                                    }
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sex">Sex</Label>
                                <UiSelect
                                    value={data.sex}
                                    onValueChange={(value) =>
                                        setData('sex', value)
                                    }
                                >
                                    <SelectTrigger className="h-12 border-white/10 bg-white/5 text-white">
                                        <SelectValue placeholder="Select sex" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#1a1a24] text-white">
                                        <SelectItem
                                            value="male"
                                            className="focus:bg-emerald-500/20"
                                        >
                                            Male
                                        </SelectItem>
                                        <SelectItem
                                            value="female"
                                            className="focus:bg-emerald-500/20"
                                        >
                                            Female
                                        </SelectItem>
                                        <SelectItem
                                            value="unknown"
                                            className="focus:bg-emerald-500/20"
                                        >
                                            Unknown
                                        </SelectItem>
                                    </SelectContent>
                                </UiSelect>
                            </div>
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-white">
                            Additional Options
                        </h2>

                        <div className="space-y-4">
                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5">
                                <Checkbox
                                    id="is_negotiable"
                                    checked={data.is_negotiable}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'is_negotiable',
                                            checked as boolean,
                                        )
                                    }
                                    className="border-white/20 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                                />
                                <div>
                                    <p className="font-medium text-white">
                                        Price is negotiable
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        Let buyers know you're open to offers
                                    </p>
                                </div>
                            </label>

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5">
                                <Checkbox
                                    id="is_delivery_available"
                                    checked={data.is_delivery_available}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'is_delivery_available',
                                            checked as boolean,
                                        )
                                    }
                                    className="border-white/20 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                                />
                                <div>
                                    <p className="font-medium text-white">
                                        Delivery available
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        You can ship or deliver to the buyer
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        <div className="text-sm text-zinc-300">
                            <p className="mb-1 font-medium text-emerald-400">
                                Tips for a great listing
                            </p>
                            <ul className="list-inside list-disc space-y-1 text-zinc-400">
                                <li>
                                    Use clear, well-lit photos from multiple
                                    angles
                                </li>
                                <li>
                                    Be specific about feeding habits and
                                    temperament
                                </li>
                                <li>
                                    Include accurate genetic information if
                                    known
                                </li>
                                <li>Set a fair price based on market rates</li>
                            </ul>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                            <Link href={home()}>
                                <X className="h-4 w-4" />
                                Cancel
                            </Link>
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2 bg-linear-to-r from-emerald-500 to-cyan-500 px-8 text-white shadow-lg shadow-emerald-500/25 transition-all hover:cursor-pointer hover:shadow-emerald-500/40"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Publish Listing
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
