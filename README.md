# Paddock FC · Prototipo e-commerce

Prototipo web de **Paddock FC**, una tienda de productos digitales de análisis de fútbol y Fórmula 1 para aficionados de Venezuela. Es la Entrega 2 (E-commerce) del curso.

**Demo en vivo:** https://gabywakil.github.io/Paddock-FC/

## Qué muestra el prototipo

| Requisito | Pantallas |
|---|---|
| Home con llamadas a la acción | Intro con semáforo de salida, hero, planes, productos destacados y testimonios |
| Navegación y selector | Catálogo con búsqueda, selector Todo/Fútbol/F1, filtros por tipo, nivel y precio, chips de filtros activos y orden |
| Gestión del carrito | Aviso de producto añadido, carrito lateral, carrito en 3 pasos, cupón `PADDOCK10`, resumen final y compra completada |
| Extra | Detalle de producto, registro, inicio de sesión y versión móvil |

La pasarela de pago, los impuestos y los envíos no forman parte del prototipo: "Confirmar y pagar" simula el pago.

## Estructura

```
Paddock-FC/
├── index.html          # Estructura de todas las pantallas
├── css/
│   └── styles.css      # Estilos, animaciones y responsive
├── js/
│   ├── data.js         # Catálogo de productos (precios en USD) e imágenes
│   └── app.js          # Rutas, filtros, carrito, cupón, intro y animaciones
└── assets/
    ├── favicon.svg
    └── img/            # Fotos del hero, tarjetas y productos
```

## Cómo verlo en local

Es un sitio estático: no necesita instalación.

```bash
git clone https://github.com/gabywakil/Paddock-FC.git
cd Paddock-FC
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`. También puedes abrir `index.html` directamente en el navegador.

## Tecnologías

- HTML, CSS y JavaScript sin frameworks
- [three.js](https://threejs.org/) para el aro 3D del hero
- Google Fonts: Barlow Condensed e Inter
- GitHub Pages para la publicación

## Equipo

Juan Pablo Calderón · Carlos Sánchez · Santiago Valencia

Paddock FC es una marca ficticia creada para un proyecto académico. No está afiliada a la Fórmula 1, la FIFA ni a ninguna liga o club.
