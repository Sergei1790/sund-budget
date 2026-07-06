import seedDemo from '@/lib/seedDemo';

export async function GET(request: Request){
    const secret = new URL(request.url).searchParams.get('secret');
    if (secret !== process.env.CRON_SECRET){
        return new Response('Unathorized', {status: 401});
    }
    await seedDemo();
    return Response.json({ok: true, message: 'Demo reset'});
}