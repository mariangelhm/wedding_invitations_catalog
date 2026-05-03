# MapBlock

Componente reutilizable para mostrar ubicación y acceso a Google Maps.

## Props
- `locationName: string`
- `address: string`
- `mapUrl: string`

## Uso
```vue
<MapBlock
  locationName="Rose Garden Hall"
  address="Santiago, Chile"
  mapUrl="https://maps.google.com/..."
/>
```

## Tooltip
Incluye un ícono de ayuda (ℹ️) que muestra instrucciones para obtener un link compartible de Google Maps:
1. Abre Google Maps
2. Busca el lugar
3. Haz clic en "Compartir"
4. Copia el enlace
