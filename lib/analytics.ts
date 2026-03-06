import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA_PROPERTY_ID;

// Helper to decode private key from Base64 (Vercel-safe)
const getCredentials = () => {
    const base64Key = process.env.GOOGLE_PRIVATE_KEY_BASE64;
    const privateKey = base64Key
        ? Buffer.from(base64Key, 'base64').toString('utf-8')
        : undefined;

    if (!privateKey) return undefined;

    return {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
    };
};

const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: getCredentials(),
});

export async function getDashboardMetrics() {
    if (!propertyId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY_BASE64) {
        console.warn('GA4 credentials missing');
        return null;
    }

    try {
        // 1. Basic Metrics (30 days)
        const [basicResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '30daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
            ],
        });

        const activeUsers = basicResponse.rows?.[0]?.metricValues?.[0]?.value || '0';
        const pageViews = basicResponse.rows?.[0]?.metricValues?.[1]?.value || '0';

        // 2. Top 5 Pages
        const [topPagesResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '30daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                { name: 'pagePath' },
                { name: 'pageTitle' }
            ],
            metrics: [
                { name: 'screenPageViews' },
            ],
            limit: 5,
            orderBys: [
                {
                    metric: { metricName: 'screenPageViews' },
                    desc: true,
                },
            ],
        });

        const topPages = topPagesResponse.rows?.map(row => ({
            path: row.dimensionValues?.[0]?.value || '',
            title: row.dimensionValues?.[1]?.value || '',
            views: row.metricValues?.[0]?.value || '0',
        })) || [];


        // 3. Realtime Users (Last 30 mins) - using runRealtimeReport
        const [realtimeResponse] = await analyticsDataClient.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [
                { name: 'activeUsers' }
            ],
            limit: 1 // Just need the total
        });

        const realtimeUsers = realtimeResponse.rows?.[0]?.metricValues?.[0]?.value || '0';


        // 4. Daily Trend (for Area Chart)
        const [trendResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '30daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                { name: 'date' }, // Returns YYYYMMDD
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
            ],
            orderBys: [
                {
                    dimension: { dimensionName: 'date' },
                },
            ],
        });

        const trend = trendResponse.rows?.map(row => {
            const dateStr = row.dimensionValues?.[0]?.value || '';
            // Format YYYYMMDD to something readable or keep compliant for charts
            // Recharts can handle formatting. Let's just return the raw or a simple format.
            // Helper for formatting YYYYMMDD to YYYY-MM-DD
            const formattedDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;

            return {
                date: formattedDate,
                activeUsers: parseInt(row.metricValues?.[0]?.value || '0'),
                pageViews: parseInt(row.metricValues?.[1]?.value || '0'),
            }
        }) || [];

        return {
            activeUsers: parseInt(activeUsers),
            pageViews: parseInt(pageViews),
            realtimeUsers: parseInt(realtimeUsers),
            topPages,
            trend,
        };

    } catch (error) {
        console.error('Error fetching GA4 data:', error);
        return null;
    }
}
