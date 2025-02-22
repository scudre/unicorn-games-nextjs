import Image from 'next/image'

const stickers = [
  {
    id: 1,
    name: 'Rainbow Unicorn',
    price: 3.99,
    image: '/stickers/rainbow-unicorn.jpg'
  },
  {
    id: 2,
    name: 'Sparkle Unicorn',
    price: 4.99,
    image: '/stickers/sparkle-unicorn.jpg'
  },
  // Add more stickers here
]

export default function Shop() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Shop Unicorn Stickers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stickers.map((sticker) => (
          <div key={sticker.id} className="bg-white rounded-lg shadow-lg p-4">
            <div className="relative h-48 w-full">
              <Image
                src={sticker.image}
                alt={sticker.name}
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold mt-2">{sticker.name}</h2>
            <p className="text-gray-600">${sticker.price}</p>
            <button className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 