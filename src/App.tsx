import { useState } from 'react';

interface WeddingInput {
    guestCount: number;
    locationType: 'rural' | 'suburban' | 'urban' | 'destination';
    cateringLevel: 'budget' | 'standard' | 'premium' | 'luxury';
    venueType: 'backyard' | 'restaurant' | 'banquet' | 'resort' | 'estate';
    miscBudget: number;
}

const LOCATION_MULTIPLIER: Record<string, number> = { rural: 0.7, suburban: 1.0, urban: 1.4, destination: 1.8 };
const CATERING_COST: Record<string, number> = { budget: 45, standard: 85, premium: 150, luxury: 250 };
const VENUE_BASE: Record<string, number> = { backyard: 500, restaurant: 3000, banquet: 6000, resort: 12000, estate: 18000 };

const WEDDING_TIPS: string[] = [
    'Guest count has the biggest impact on total cost',
    'Off-peak seasons and weekdays often cost less',
    'Prioritize what matters most to you as a couple',
    'Build in a 10-15% buffer for unexpected expenses'
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function App() {
    const [values, setValues] = useState<WeddingInput>({ guestCount: 120, locationType: 'suburban', cateringLevel: 'standard', venueType: 'banquet', miscBudget: 5000 });
    const handleChange = (field: keyof WeddingInput, value: string | number) => setValues(prev => ({ ...prev, [field]: value }));

    const locationMultiplier = LOCATION_MULTIPLIER[values.locationType];
    const cateringPerGuest = CATERING_COST[values.cateringLevel];
    const venueBase = VENUE_BASE[values.venueType];

    // Calculate costs
    const venueCost = Math.round(venueBase * locationMultiplier);
    const cateringCost = Math.round(values.guestCount * cateringPerGuest * locationMultiplier);
    const otherCosts = values.miscBudget;

    const totalCost = venueCost + cateringCost + otherCosts;
    const costPerGuest = values.guestCount > 0 ? Math.round(totalCost / values.guestCount) : 0;

    const breakdownData = [
        { label: 'Venue', value: fmt(venueCost), isTotal: false },
        { label: 'Catering', value: fmt(cateringCost), isTotal: false },
        { label: 'Other Costs', value: fmt(otherCosts), isTotal: false },
        { label: 'Estimated Total', value: fmt(totalCost), isTotal: true }
    ];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Wedding Budget Calculator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Estimate total wedding cost based on your preferences</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div>
                        <label htmlFor="guestCount">Guest Count</label>
                        <input id="guestCount" type="number" min="10" max="500" step="5" value={values.guestCount || ''} onChange={(e) => handleChange('guestCount', parseInt(e.target.value) || 0)} placeholder="120" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="locationType">Location Type</label>
                            <select id="locationType" value={values.locationType} onChange={(e) => handleChange('locationType', e.target.value)}>
                                <option value="rural">Rural</option>
                                <option value="suburban">Suburban</option>
                                <option value="urban">Urban / Metro</option>
                                <option value="destination">Destination</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="venueType">Venue Type</label>
                            <select id="venueType" value={values.venueType} onChange={(e) => handleChange('venueType', e.target.value)}>
                                <option value="backyard">Backyard / DIY</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="banquet">Banquet Hall</option>
                                <option value="resort">Resort / Hotel</option>
                                <option value="estate">Estate / Mansion</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="cateringLevel">Catering Level</label>
                            <select id="cateringLevel" value={values.cateringLevel} onChange={(e) => handleChange('cateringLevel', e.target.value)}>
                                <option value="budget">Budget (~$45/guest)</option>
                                <option value="standard">Standard (~$85/guest)</option>
                                <option value="premium">Premium (~$150/guest)</option>
                                <option value="luxury">Luxury (~$250/guest)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="miscBudget">Miscellaneous Budget ($)</label>
                            <input id="miscBudget" type="number" min="0" max="100000" step="500" value={values.miscBudget || ''} onChange={(e) => handleChange('miscBudget', parseInt(e.target.value) || 0)} placeholder="5000" />
                        </div>
                    </div>
                    <button className="btn-primary" type="button">Calculate Budget</button>
                </div>
            </div>

            <div className="card results-panel">
                <div className="text-center">
                    <h2 className="result-label" style={{ marginBottom: 'var(--space-2)' }}>Estimated Total Wedding Cost</h2>
                    <div className="result-hero">{fmt(totalCost)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>for {values.guestCount} guests</div>
                </div>
                <hr className="result-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div className="result-label">Cost Per Guest</div>
                        <div className="result-value">{fmt(costPerGuest)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div className="result-label">Catering Total</div>
                        <div className="result-value">{fmt(cateringCost)}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Budget Planning Tips</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {WEDDING_TIPS.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Budget Breakdown</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {breakdownData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === breakdownData.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: row.isTotal ? '#F0F9FF' : (i % 2 ? '#F8FAFC' : 'transparent') }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontWeight: row.isTotal ? 600 : 400 }}>{row.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: row.isTotal ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This calculator provides estimates of wedding costs based on general industry averages and the selections made. Actual costs vary significantly by region, vendor, season, and specific choices. The figures shown are estimates only and should be used as a starting point for budget planning. Get quotes from local vendors for accurate pricing in your area.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Simplified assumptions</li><li>• Free to use</li>
                </ul>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Wedding Budget Calculator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
