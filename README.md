# CuentosMusicalesParaElAlma

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# SQL

-- Eliminar tablas en orden correcto (por las dependencias)
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS interactive_elements CASCADE;
DROP TABLE IF EXISTS teaching_guides CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS menu_levels CASCADE;
DROP TABLE IF EXISTS admin CASCADE;

-- Crear tabla de administrador
CREATE TABLE admin (
id BIGSERIAL PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla para el menú multinivel
CREATE TABLE menu_levels (
id BIGSERIAL PRIMARY KEY,
menu_structure JSONB NOT NULL,
active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de cuentos
CREATE TABLE stories (
id BIGSERIAL PRIMARY KEY,
title VARCHAR(200) NOT NULL,
slug VARCHAR(200) UNIQUE NOT NULL,
description TEXT,
content TEXT NOT NULL,
price DECIMAL(10,2) NOT NULL,
stripe_price_id VARCHAR(100),
preview_content TEXT,
cover_image_url VARCHAR(255),
image_url VARCHAR(255), -- Added imageUrl
has_interactive_elements BOOLEAN DEFAULT false, -- Added hasInteractiveElements
menu_level_id BIGINT[], -- Array of menu_level_id values
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de guías didácticas
CREATE TABLE teaching_guides (
id BIGSERIAL PRIMARY KEY,
story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
preview TEXT NOT NULL,
full_content TEXT,
download_url VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de elementos interactivos
CREATE TABLE interactive_elements (
id BIGSERIAL PRIMARY KEY,
story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
title VARCHAR(200) NOT NULL,
description TEXT,
type VARCHAR(50) NOT NULL CHECK (type IN ('game', 'quiz', 'activity')),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de ventas
CREATE TABLE sales (
id BIGSERIAL PRIMARY KEY,
stripe_payment_id VARCHAR(100) UNIQUE NOT NULL,
story_id BIGINT REFERENCES stories(id),
amount DECIMAL(10,2) NOT NULL,
customer_email VARCHAR(100),
status VARCHAR(50) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar estructura del menú principal
INSERT INTO menu_levels (menu_structure, active, created_at, updated_at)
VALUES (
'{
"items": [
{
"id": 2,
"title": "Cuentos",
"children": [
{
"id": 21,
"title": "Por Edad",
"children": [
{
"id": 211,
"title": "3-5 años",
"route": "/category/3-5"
},
{
"id": 212,
"title": "6-8 años",
"route": "/category/6-8"
},
{
"id": 213,
"title": "9-12 años",
"route": "/category/9-12"
}
]
},
{
"id": 22,
"title": "Más Recientes",
"route": "/recent"
},
{
"id": 23,
"title": "Más Populares",
"route": "/popular"
}
]
},
{
"id": 2,
"title": "Guías Didácticas",
"route": "/guides"
},
{
"id": 3,
"title": "Sobre Nosotros",
"route": "/about"
},
{
"id": 4,
"title": "Contacto",
"route": "/contact"
}
]
}'::jsonb,
true,
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_menu_levels_active ON menu_levels(active);
CREATE INDEX idx_teaching_guides_story ON teaching_guides(story_id);
CREATE INDEX idx_interactive_elements_story ON interactive_elements(story_id);

-- Insertar cuentos mock con menu_level_id como un array
INSERT INTO stories (title, slug, description, content, price, stripe_price_id, preview_content, cover_image_url, image_url, has_interactive_elements, menu_level_id, created_at, updated_at)
VALUES
(
'El Cuento del Conejo Valiente',
'el-cuento-del-conejo-valiente',
'Un cuento sobre un conejo que enfrenta sus miedos.',
'Había una vez un conejo que vivía en un bosque...',
9.99,
'price_1',
'Había una vez un conejo que vivía en un bosque...',
'https://dummyimage.com/600x400/000/fff&text=Conejo+Valiente',
'https://dummyimage.com/600x400/000/fff&text=Conejo+Valiente',
true,
ARRAY[211, 22], -- Array of menu_level_id values
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
'La Aventura del Dragón Dorado',
'la-aventura-del-dragon-dorado',
'Un dragón dorado busca su hogar perdido.',
'En una tierra lejana, un dragón dorado volaba por los cielos...',
12.99,
'price_2',
'En una tierra lejana, un dragón dorado volaba por los cielos...',
'https://dummyimage.com/600x400/000/fff&text=Dragón+Dorado',
'https://dummyimage.com/600x400/000/fff&text=Dragón+Dorado',
false,
ARRAY[212, 23], -- Array of menu_level_id values
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
'El Pequeño Elefante Curioso',
'el-pequeno-elefante-curioso',
'Un cuento sobre un elefante que descubre el mundo.',
'Había una vez un pequeño elefante que siempre tenía curiosidad por todo...',
8.99,
'price_3',
'Había una vez un pequeño elefante que siempre tenía curiosidad por todo...',
'https://dummyimage.com/600x400/000/fff&text=Elefante+Curioso',
'https://dummyimage.com/600x400/000/fff&text=Elefante+Curioso',
true,
ARRAY[211], -- Associated with 3-5 años
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
'El Misterio del Bosque Encantado',
'el-misterio-del-bosque-encantado',
'Un cuento sobre un grupo de amigos que exploran un bosque mágico.',
'En un pequeño pueblo, un grupo de amigos decidió explorar el bosque cercano...',
10.99,
'price_4',
'En un pequeño pueblo, un grupo de amigos decidió explorar el bosque cercano...',
'https://dummyimage.com/600x400/000/fff&text=Bosque+Encantado',
'https://dummyimage.com/600x400/000/fff&text=Bosque+Encantado',
true,
ARRAY[212], -- Associated with 6-8 años
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
'La Leyenda del Fénix',
'la-leyenda-del-fenix',
'Un cuento sobre la mítica ave que renace de sus cenizas.',
'En un reino lejano, existía una leyenda sobre un ave mágica...',
14.99,
'price_5',
'En un reino lejano, existía una leyenda sobre un ave mágica...',
'https://dummyimage.com/600x400/000/fff&text=Fénix',
'https://dummyimage.com/600x400/000/fff&text=Fénix',
false,
ARRAY[213], -- Associated with 9-12 años
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
'El Viaje del Pequeño Barco',
'el-viaje-del-pequeno-barco',
'Un cuento sobre un pequeño barco que navega por el océano.',
'Había una vez un pequeño barco que soñaba con explorar el vasto océano...',
7.99,
'price_6',
'Había una vez un pequeño barco que soñaba con explorar el vasto océano...',
'https://dummyimage.com/600x400/000/fff&text=Pequeño+Barco',
'https://dummyimage.com/600x400/000/fff&text=Pequeño+Barco',
true,
ARRAY[22], -- Associated with Más Recientes
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
'El Tesoro del Pirata Perdido',
'el-tesoro-del-pirata-perdido',
'Un cuento sobre un pirata que busca un tesoro legendario.',
'En una isla remota, un pirata llamado Jack buscaba un tesoro perdido...',
11.99,
'price_7',
'En una isla remota, un pirata llamado Jack buscaba un tesoro perdido...',
'https://dummyimage.com/600x400/000/fff&text=Pirata+Perdido',
'https://dummyimage.com/600x400/000/fff&text=Pirata+Perdido',
false,
ARRAY[23], -- Associated with Más Populares
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
);

-- Insertar guías didácticas mock
INSERT INTO teaching_guides (story_id, preview, full_content, download_url, created_at, updated_at)
VALUES
(
1, -- Reference to stories.id
'Guía didáctica para "El Cuento del Conejo Valiente".',
'Contenido completo de la guía didáctica...',
'https://example.com/downloads/guide-conejo-valiente.pdf',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
3, -- Reference to stories.id
'Guía didáctica para "El Pequeño Elefante Curioso".',
'Contenido completo de la guía didáctica...',
'https://example.com/downloads/guide-elefante-curioso.pdf',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
4, -- Reference to stories.id
'Guía didáctica para "El Misterio del Bosque Encantado".',
'Contenido completo de la guía didáctica...',
'https://example.com/downloads/guide-bosque-encantado.pdf',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
5, -- Reference to stories.id
'Guía didáctica para "La Leyenda del Fénix".',
'Contenido completo de la guía didáctica...',
'https://example.com/downloads/guide-fenix.pdf',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
);

-- Insertar elementos interactivos mock
INSERT INTO interactive_elements (story_id, title, description, type, created_at, updated_at)
VALUES
(
1, -- Reference to stories.id
'Juego: Atrapa las Zanahorias',
'Un juego interactivo para niños.',
'game',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
1, -- Reference to stories.id
'Quiz: Preguntas sobre el Conejo Valiente',
'Un quiz para evaluar la comprensión del cuento.',
'quiz',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
3, -- Reference to stories.id
'Juego: Encuentra las Frutas',
'Un juego interactivo para niños.',
'game',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
3, -- Reference to stories.id
'Quiz: Preguntas sobre el Elefante Curioso',
'Un quiz para evaluar la comprensión del cuento.',
'quiz',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
4, -- Reference to stories.id
'Juego: Resuelve el Misterio',
'Un juego interactivo para niños.',
'game',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
),
(
4, -- Reference to stories.id
'Quiz: Preguntas sobre el Bosque Encantado',
'Un quiz para evaluar la comprensión del cuento.',
'quiz',
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP
);
