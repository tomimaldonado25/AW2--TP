# Levantar PostgreSQL con Docker

## 1. Construir la imagen
```bash
docker build -t pg-tienda .
```

## 2. Correr el contenedor
```bash
docker run -d --name pg-tienda -p 5432:5432 pg-tienda
```

## 3. Cargar el SQL inicial
```bash
docker exec -i pg-tienda psql -U root -d tienda < tienda.sql
```

## 4. Conectarse para verificar
```bash
docker exec -it pg-tienda psql -U root -d tienda
SELECT * FROM productos;
```
