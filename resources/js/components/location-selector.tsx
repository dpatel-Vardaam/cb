import { useCallback, useEffect, useMemo, useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';

import { US_STATES } from '@/data/states';

// 1. Define Option Type for React Select
type OptionType = {
    value: string;
    label: string;
    code?: string;
};

type LocationSelectorProps = {
    initialState?: string;
    initialCity?: string;
    onLocationChange: (data: { state: string; city: string }) => void;
    className?: string;
};

export default function LocationSelector({
    initialState = '',
    initialCity = '',
    onLocationChange,
    className = '',
}: LocationSelectorProps) {
    const [selectedState, setSelectedState] = useState<OptionType | null>(null);
    const [selectedCity, setSelectedCity] = useState<OptionType | null>(null);
    const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 2. Prepare State Options (Memoized for performance)
    const stateOptions: OptionType[] = useMemo(
        () =>
            US_STATES.map((s) => ({
                value: s.name,
                label: s.name,
                code: s.code,
            })),
        [],
    );

    const loadCities = useCallback(
        async (stateCode: string, preselectCityName?: string) => {
            setIsLoading(true);
            try {
                // Lazy load the JSON
                const module = await import('@/data/cities.json');
                const rawCities: string[] =
                    (module.default as Record<string, string[]>)[stateCode] ||
                    [];

                // Transform strings to React Select format
                const options = rawCities.map((city) => ({
                    value: city,
                    label: city,
                }));
                setCityOptions(options);

                // If we have an initial city, set it now that options are loaded
                if (preselectCityName) {
                    const cityObj = options.find(
                        (c) => c.value === preselectCityName,
                    );
                    if (cityObj) setSelectedCity(cityObj);
                }
            } catch (error) {
                console.error('Failed to load cities', error);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    // 3. Initialize from Props (Run once on mount)
    useEffect(() => {
        if (initialState) {
            const stateObj = stateOptions.find(
                (s) => s.value === initialState || s.code === initialState,
            );
            if (stateObj) {
                setSelectedState(stateObj);
                // Trigger city load
                loadCities(stateObj.code ?? '', initialCity);
            }
        }
    }, [initialCity, initialState, loadCities, stateOptions]);

    const handleStateChange = (option: SingleValue<OptionType>) => {
        setSelectedState(option);
        setSelectedCity(null); // Reset city
        setCityOptions([]); // Clear old cities

        const newStateName = option ? option.value : '';
        const newStateCode = option?.code ?? '';

        // Notify Parent
        onLocationChange({ state: newStateName, city: '' });

        if (newStateCode) {
            loadCities(newStateCode);
        }
    };

    const handleCityChange = (option: SingleValue<OptionType>) => {
        setSelectedCity(option);
        onLocationChange({
            state: selectedState?.value || '',
            city: option ? option.value : '',
        });
    };

    // 4. Custom Dark Mode Styles to match your UI
    const customStyles: StylesConfig<OptionType, false> = {
        control: (base, state) => ({
            ...base,
            backgroundColor: '#0f0f15', // Your dark bg
            borderColor: state.isFocused
                ? '#10b981'
                : 'rgba(255, 255, 255, 0.1)', // Emerald or White/10
            color: 'white',
            minHeight: '40px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
            },
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#0f0f15',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 50,
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 60,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#10b981' // Emerald-500
                : state.isFocused
                  ? 'rgba(16, 185, 129, 0.1)' // Emerald tint on hover
                  : 'transparent',
            color: state.isSelected ? 'black' : 'white',
            cursor: 'pointer',
            ':active': {
                backgroundColor: '#10b981',
            },
        }),
        singleValue: (base) => ({
            ...base,
            color: 'white',
        }),
        input: (base) => ({
            ...base,
            color: 'white',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#71717a', // zinc-500
        }),
    };

    return (
        <div className={`grid grid-cols-2 gap-2 ${className}`}>
            <div className="space-y-1">
                <Select
                    value={selectedState}
                    onChange={handleStateChange}
                    options={stateOptions}
                    styles={customStyles}
                    placeholder="State"
                    isClearable
                    menuPortalTarget={
                        typeof document !== 'undefined'
                            ? document.body
                            : undefined
                    }
                    menuPosition="fixed"
                    classNamePrefix="react-select"
                />
            </div>

            <div className="space-y-1">
                <Select
                    value={selectedCity}
                    onChange={handleCityChange}
                    options={cityOptions}
                    styles={customStyles}
                    placeholder={isLoading ? 'Loading...' : 'City'}
                    isDisabled={!selectedState || isLoading}
                    isClearable
                    isLoading={isLoading}
                    menuPortalTarget={
                        typeof document !== 'undefined'
                            ? document.body
                            : undefined
                    }
                    menuPosition="fixed"
                    classNamePrefix="react-select"
                />
            </div>
        </div>
    );
}
