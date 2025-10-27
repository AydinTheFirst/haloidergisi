export default function HeroFeatured() {
  return (
    <div className='relative h-screen w-full'>
      <img
        alt='29 Ekim'
        className='absolute inset-0 h-full w-full blur-2xl'
        src='banner-29oct.png'
      />
      <img
        alt='29 Ekim'
        className='absolute inset-0 h-full w-full object-cover md:object-contain'
        src='banner-29oct.png'
      />
      <div className='absolute inset-0 bg-black/40' />

      <div className='relative z-10 container flex h-full items-center justify-center p-4 text-center text-3xl font-bold text-white md:text-5xl'>
        🇹🇷 Cumhuriyet Bayramımız Kutlu Olsun! 🎉
      </div>
    </div>
  );
}
