# GalleryBlock

Bloque reutilizable para mostrar una galería romántica de momentos.

## Props
- `title?: string` (default: `Nuestros momentos`)
- `images?: Array<{ src: string; alt?: string }>`

## Propósito
- Renderizar una galería moderna (asimétrica en desktop, simple en mobile).
- Mostrar placeholders elegantes cuando aún no existen imágenes.
- Diseñado para reutilización futura en templates y drag & drop.

## Uso
```vue
<GalleryBlock
  title="Nuestros momentos"
  :images="[
    { src: 'https://images.unsplash.com/photo-1', alt: 'Foto pareja 1' },
    { src: 'https://images.unsplash.com/photo-2', alt: 'Foto pareja 2' },
    { src: 'https://images.unsplash.com/photo-3', alt: 'Foto pareja 3' }
  ]"
/>
```
