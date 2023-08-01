# GoogleChartsModelado

### Link de las imagenes de docker: https://drive.google.com/drive/folders/1djDNZPWFrJHp797OlZoxPk4E-tei2YDz?usp=drive_link

### Descargar las 2 imagens y des pues con el siguiente comando agregar las imagenes a docker:

  docker load < C:/nombre_del_archivo.tar

### Descargar y correr el servidor WEB

  docker run -p 8091:80 --name appnginx -v C:/modelado:/usr/share/nginx/html:ro -d nginx

### Agregar los tres archivos a la endonde se haya vinculado con el servidor

  index.html

  styles.css

  scripst.js

### Con el comando docker run, correr los tres contenedores

### Configurar una red en docker para la conexion entre contenedores:

  docker network create --driver bridge nombre_red
  
  docker network connect nombre_red nombre_contenedor


## Visualizacion por el siguiente enlace en su navegador

http://localhost:8091/
