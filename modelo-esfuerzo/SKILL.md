---
name: modelo-esfuerzo
description: Recomienda a David qué modelo (Haiku, Sonnet, Opus, Fable) y qué nivel de esfuerzo usar para la tarea que va a empezar, para ahorrar uso sin perder calidad. Úsala al arrancar un chat, al empezar una tarea o fase nueva cuya dificultad sea distinta de la anterior (p. ej. de investigar a programar, de programar a tareas mecánicas), y cuando David pregunte "qué modelo uso", "qué esfuerzo pongo", "esto lo puede hacer Sonnet/Haiku?", "cómo ahorro tokens".
---

# Modelo y esfuerzo para cada tarea

Objetivo: que David gaste el uso de su plan donde aporta y alargue el tiempo de trabajo. Un modelo más
caro o un esfuerzo mayor **no** dan mejor resultado en tareas sencillas: solo tardan más y consumen más.

## Cuándo avisar

- Al empezar un chat y cada vez que **cambie la naturaleza del trabajo** (no en cada mensaje).
- Si el modelo o esfuerzo actuales ya encajan, **no digas nada** (o como mucho «✔ el modelo actual va bien»).
- Si la tarea se complica a mitad (algo atascado, decisión de arquitectura, riesgo en producción), avisa de subir.

## Formato del aviso

Una sola línea, al principio de la respuesta, antes de ponerte a trabajar:

> **Modelo recomendado:** Sonnet 5.5 · esfuerzo medio — maquetar y ajustar CSS es trabajo rutinario.

Si recomiendas cambiar, añade cómo hacerlo: en la app, el selector de modelo y esfuerzo junto al cuadro de
texto; o "si quieres, lo cambio yo" (herramientas `set_session_model` / `set_session_effort`, solo con su OK).
No esperes respuesta para empezar si la tarea ya está clara: el aviso es informativo.

## Coste relativo (precio por token, aproximado)

| Modelo | Coste frente a Sonnet | Para qué |
|---|---|---|
| Haiku 5.5 | ~1/20 | Mecánico y repetitivo, sin decisiones |
| Sonnet 5.5 | 1× | El día a día: la mayoría del trabajo |
| Opus 5.5 | 2× | Lo difícil o delicado, decisiones que cuesta deshacer |
| Fable 5.2 | 4× | Casi nunca: solo si Opus a esfuerzo alto se ha atascado de verdad |

El **esfuerzo** (bajo, medio, alto, muy alto, máximo) regula cuánto piensa el modelo antes de actuar.
Subirlo multiplica el gasto en tareas largas; en tareas sencillas no mejora nada.

## Tabla de decisión (tareas típicas de David)

| Tarea | Recomendación |
|---|---|
| Preguntas rápidas, mover/renombrar/ordenar archivos, leer o actualizar un `CLAUDE.md`, ejecutar un script ya hecho, comprobar que algo carga | **Haiku 5.5 · bajo** (o Sonnet · bajo si hay herramientas complicadas de por medio) |
| Navegar un panel o una web siguiendo pasos, descargas, copias, cambios de texto o de estilos concretos | **Sonnet 5.5 · bajo/medio** |
| Maquetar páginas, CSS, responsive, plantillas de un tema que ya tiene su estructura, scripts de AE o Blender sencillos, ajustes de animación | **Sonnet 5.5 · medio** |
| Funcionalidad nueva de cierto tamaño (un tipo de contenido, un formulario, un filtro), scripts de AE/Blender con varias capas o pasos | **Sonnet 5.5 · alto** u **Opus 5.5 · medio** |
| Planificar un proyecto, decidir la arquitectura, migraciones de datos (p. ej. Avada → contenido limpio), registro de usuarios y contenido privado, seguridad, publicar en producción, depurar algo que lleva rato atascado | **Opus 5.5 · alto** |
| Problemas muy difíciles que Opus · alto no resuelve | **Opus 5.5 · muy alto**; Fable 5.2 solo como último recurso |
| Trabajo 3D/Blender en el que hay que explicar mucho a David | Sonnet 5.5 · medio basta para explicar; sube a Opus si la escena o el pipeline se complican |

Regla rápida: **¿se puede deshacer fácil y es rutinario? → Sonnet (o Haiku). ¿Es delicado, nuevo o
difícil de deshacer? → Opus.**

## Cambiar de modelo a mitad de un chat

No se rompe nada: el chat conserva todo lo hablado. Pero tiene un coste: cada modelo guarda en caché la
conversación, y al cambiar, el nuevo modelo tiene que **releer todo el historial a precio completo** en el
siguiente mensaje. En un chat largo, ese mensaje cuesta bastante más de lo normal (por eso la app avisa).

- Cambia de modelo **al empezar una fase**, no para un mensaje suelto y volver.
- Si el chat ya es muy largo y la fase nueva es distinta, suele salir mejor **abrir un chat nuevo** en la
  carpeta del proyecto: el `CLAUDE.md` le da el contexto y arranca ligero.
- Cambiar solo el esfuerzo también puede invalidar la caché; igual que con el modelo, hazlo al cambiar de fase.
