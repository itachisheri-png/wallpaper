import { Image } from '../types';

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

export async function searchImages(query: string, page: number = 1): Promise<Image[]> {
  if (!ACCESS_KEY) {
    // Fallback to mock data if no API key
    return getMockImages(query);
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=20&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch images');

    const data = await response.json();
    
    // If Unsplash returns no results (common for "Anime"), fallback to our curated mock data
    if (!data.results || data.results.length === 0) {
      return getMockImages(query);
    }

    return data.results.map((item: any, index: number) => ({
      id: item.id,
      url: item.urls.full,
      downloadUrl: item.links.download_location,
      thumbnailUrl: item.urls.regular,
      title: item.description || item.alt_description || 'Untitled',
      author: item.user.name,
      isPremium: index % 5 === 0, // Mock premium status
      width: item.width,
      height: item.height,
    }));
  } catch (error) {
    console.error('Error fetching images:', error);
    return getMockImages(query);
  }
}

export async function getPopularImages(): Promise<Image[]> {
  if (!ACCESS_KEY) {
    return getMockImages('popular');
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos?order_by=popular&per_page=20`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch images');

    const data = await response.json();
    return data.map((item: any, index: number) => ({
      id: item.id,
      url: item.urls.full,
      downloadUrl: item.links.download_location,
      thumbnailUrl: item.urls.regular,
      title: item.description || item.alt_description || 'Untitled',
      author: item.user.name,
      isPremium: index % 5 === 0,
      width: item.width,
      height: item.height,
    }));
  } catch (error) {
    console.error('Error fetching popular images:', error);
    return getMockImages('popular');
  }
}

function getMockImages(query: string): Image[] {
  const seed = query.toLowerCase();
  
  const pexelsCollection: Image[] = [
    { id: 'px-1', title: 'Majestic Lion Portrait', author: 'Pixabay', url: 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-2', title: 'Emerald Forest Stream', author: 'James Wheeler', url: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: false, width: 3840, height: 2160 },
    { id: 'px-3', title: 'Abstract Color Swirl', author: 'Padrinan', url: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-4', title: 'Cyberpunk City Lights', author: 'Tobi', url: 'https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-5', title: 'Serene Mountain Lake', author: 'Luis del Río', url: 'https://images.pexels.com/photos/15286/pexels-photo-15286.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/15286/pexels-photo-15286.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/15286/pexels-photo-15286.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: false, width: 3840, height: 2160 },
    { id: 'px-6', title: 'Starry Night Mountains', author: 'Stein Egil Liland', url: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-7', title: 'Tropical Beach Paradise', author: 'Asad Photo Maldives', url: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: false, width: 3840, height: 2160 },
    { id: 'px-8', title: 'Misty Autumn Forest', author: 'Sebastian Voortman', url: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: false, width: 3840, height: 2160 },
    { id: 'px-9', title: 'Golden Hour Landscape', author: 'Pixabay', url: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-10', title: 'Neon Tokyo Streets', author: 'Aleksandar Pasaric', url: 'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-11', title: 'Crystal Clear Alpine Lake', author: 'Simon Migaj', url: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-12', title: 'Red Supercar Speed', author: 'Pexels User', url: 'https://images.pexels.com/photos/1402717/pexels-photo-1402717.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/1402717/pexels-photo-1402717.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/1402717/pexels-photo-1402717.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-13', title: 'Modern Glass Architecture', author: 'Pixabay', url: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: false, width: 3840, height: 2160 },
    { id: 'px-14', title: 'Hidden Jungle Waterfall', author: 'Pexels User', url: 'https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: false, width: 3840, height: 2160 },
    { id: 'px-15', title: 'Deep Space Nebula', author: 'Pexels User', url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-16', title: 'Snowy Peak Sunrise', author: 'Eberhard Grossgasteiger', url: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: false, width: 3840, height: 2160 },
    { id: 'px-17', title: 'Arctic Wolf Stare', author: 'Pexels User', url: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
    { id: 'px-18', title: 'Vibrant Sunset Horizon', author: 'Pexels User', url: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: false, width: 3840, height: 2160 },
    { id: 'px-19', title: 'Distant Mountain Range', author: 'Pexels User', url: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: false, width: 3840, height: 2160 },
    { id: 'px-20', title: 'Minimalist White Building', author: 'Pexels User', url: 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=3840', thumbnailUrl: 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=800', downloadUrl: 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=3840', isPremium: true, width: 3840, height: 2160 },
  ];

  if (seed === 'popular' || seed === 'all') {
    return pexelsCollection;
  }
  
  const categorySeeds: Record<string, string[]> = {
    cars: [
      '1533473359331-0135ef1b58bf', // BMW
      '1492144531280-a23e82822da4', // Sports car
      '1525609004856-26891eff5d1a', // Luxury interior
      '1503376780353-7a6c22bd0a38', // Offroad
      '1583121274602-3e2820c75ce3', // Red supercar
      '1502877338535-76d3ea517f52', // Classic car
      '1493238555826-5350102445a6', // Night city drive
      '1493976040374-85c8e12f0c0e', // Mountain road
      '1550064824-8f9930419395', // Engine
      '1494697536444-886fe1f4f042'  // Steering wheel
    ],
    anime: [
      '1578632738988-489ad3d46a5a', // Digital landscape
      '1614728263952-84ea256f9679', // Cyberpunk neon
      '1541562232579-512a21360020', // Moon art
      '1634157703702-3c124ce66c89', // Aesthetic street
      '1550684848-fac1c5b4e853', // Geometric patterns
      '1605142859662-aa605804561b', // Night lights
      '1615467406214-7299103ee24c', // Futuristic city
      '1611384032483-d5e89d533469', // Colorful sky
      '1624496150151-53434608316c', // Space swirl
      '1616428271167-33632f144365'  // Neon vibes
    ],
    nature: [
      '1470071459604-3b5ec3a7fe05',
      '1501785888041-af3ef285b470',
      '1440615423403-89926b2bb3a7',
      '1472214603491-584506f2545c',
      '1433062634351-a90dbd763ed0'
    ],
    architecture: [
      '1486406146926-c627a92ad1ab',
      '1510641046644-245f85eaa0e3',
      '1516455590571-18256e5bb9ff',
      '1428360934525-9988547442a8'
    ],
    technology: [
      '1518770660439-4636190af475',
      '1519389950473-47ba0277781c',
      '1550751827-4bd374c3f58b',
      '1451187580459-43490279c0fa'
    ],
    abstract: [
      '1541701494587-cb58502866ab',
      '1550684848-fac1c5b4e853',
      '1508247967583-7d982ea01526'
    ]
  };

  const getIds = (cat: string) => categorySeeds[cat] || [
    '1501785888041-af3ef285b470',
    '1506744038136-46273834b3fb',
    '1470071459604-3b5ec3a7fe05'
  ];

  const currentIds = getIds(seed);

  return Array.from({ length: 20 }).map((_, i) => {
    const photoId = currentIds[i % currentIds.length];
    const finalUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=3840&q=80&sig=${seed}-${i}`;

    return {
      id: `mock-${seed}-${i}`,
      url: finalUrl,
      downloadUrl: finalUrl,
      thumbnailUrl: `${finalUrl}&w=800`,
      title: `${query.charAt(0).toUpperCase() + query.slice(1)} 4K Ultra HD ${i + 1}`,
      author: '4K Vision Contributor',
      isPremium: i % 5 === 0,
      width: 3840,
      height: 2160,
    };
  });
}
