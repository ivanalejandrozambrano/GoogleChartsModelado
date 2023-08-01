# GoogleChartsModelado

Link de las imagenes de docker: https://drive.google.com/drive/folders/1djDNZPWFrJHp797OlZoxPk4E-tei2YDz?usp=drive_link
Descargar las 3 imagens y des pues con el siguiente comando agregar las imagenes a docker:
  docker load < C:/nombre_del_archivo.tar

Con el comando docker run, correr los tres contenedores
Configurar una red en docker para la conexion entre contenedores:
  docker network create --driver bridge nombre_red
  docker network connect nombre_red nombre_contenedor
