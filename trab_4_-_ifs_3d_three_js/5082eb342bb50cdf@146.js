function _1(md){return(
md`# IFS 3D com three.js`
)}

function _maxLevel(Inputs){return(
Inputs.radio([0, 1, 2, 3, 4, 5], {
  label: "Max Level",
  value: 0
})
)}

function _colorLevel(Inputs,d3,maxLevel){return(
Inputs.radio(d3.range(maxLevel + 1), {
  label: "Color Level",
  value: 0
})
)}

function _jsonFile(Inputs){return(
Inputs.file({ label: "JSON scene file" })
)}

function _5(THREE,htl,invalidation,fractalScene)
{
  const renderer = new THREE.WebGLRenderer({
    canvas: htl.html`<canvas width=900 height=650>`,
    antialias: true
  });
  renderer.shadowMap.enabled = true;
  const camera = new THREE.PerspectiveCamera(80, 6 / 3, 0.1, 10);
  camera.position.set(0, 0, 4);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.screenSpacePanning = true;
  invalidation.then(() => (controls.dispose(), renderer.dispose()));
  controls.addEventListener("change", () =>
    renderer.render(fractalScene, camera)
  );
  renderer.render(fractalScene, camera);
  return renderer.domElement;
}


async function _THREE(require)
{
  const THREE = (window.THREE = await require("three@0.141"));
  await require("three@0.141/examples/js/controls/OrbitControls.js").catch(
    () => {}
  );
  return THREE;
}


function _sceneJSON(jsonFile,FileAttachment){return(
jsonFilex
  ? jsonFile.json()
  : FileAttachment("scene@4.json").json()
)}

function _loadedScene(THREE,sceneJSON)
{
  const loader = new THREE.ObjectLoader();
  return loader.parse(sceneJSON);
}


function _fractalScene(loadedScene,maxLevel,makeCopies,makeLoop)
{
    let scene = loadedScene.clone();
    if (maxLevel == 0) return loadedScene.clone();
    let copies = makeCopies(scene);
    scene.remove(...copies);
    let level = []
    for(let i = 0; i < copies.length; i++){let obj = copies[i].clone();obj.matrixAutoUpdate = false;level.push(obj);}
    level = makeLoop(maxLevel, level, copies);
    scene.add(...level);
    return scene;
}


function _makeCopies(){return(
function makeCopies(scene) {
  return scene.children.filter(
        (child) => child.name.slice(0, 4) == "copy"
    );
}
)}

function _makeLoop(colorLevel){return(
function makeLoop(maxLevel, up, copies) {
  
    let i = 0;
    while ( i < maxLevel) {
        i++;
        let proximo = [];
        for (let copy of copies) {
            for (let obj of up) {
                let element;
                if (i != colorLevel - 1) {
                    element = obj.clone();
                    element.matrix.multiply(copy.matrix);
                } else {
                    element = copy.clone();
                    element.matrix.premultiply(obj.matrix);
                }
                element.castShadow = copy.castShadow;
                element.receiveShadow = copy.receiveShadow;
                element.matrixAutoUpdate = false;
                element.matrixWorldNeedsUpdate = true;
                proximo.push(element);
            }
        }
        up = proximo;
    }
  return up
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["scene@4.json", {url: new URL("./files/7ac6d2e115d09a9bcd0e455d2c4d8e0ff6d01b2f1a2465469800223eb2e031626a7f88aaf1eb2361d40fa75f2b7582024c4968b45e05392b29aa154d7605fdfc.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof maxLevel")).define("viewof maxLevel", ["Inputs"], _maxLevel);
  main.variable(observer("maxLevel")).define("maxLevel", ["Generators", "viewof maxLevel"], (G, _) => G.input(_));
  main.variable(observer("viewof colorLevel")).define("viewof colorLevel", ["Inputs","d3","maxLevel"], _colorLevel);
  main.variable(observer("colorLevel")).define("colorLevel", ["Generators", "viewof colorLevel"], (G, _) => G.input(_));
  main.variable(observer("viewof jsonFile")).define("viewof jsonFile", ["Inputs"], _jsonFile);
  main.variable(observer("jsonFile")).define("jsonFile", ["Generators", "viewof jsonFile"], (G, _) => G.input(_));
  main.variable(observer()).define(["THREE","htl","invalidation","fractalScene"], _5);
  main.variable(observer("THREE")).define("THREE", ["require"], _THREE);
  
  /*  
  main.variable(observer("sceneJSON")).define("sceneJSON", ["jsonFile","FileAttachment"], _sceneJSON);
  main.variable(observer("loadedScene")).define("loadedScene", ["THREE","sceneJSON"], _loadedScene);
  main.variable(observer("fractalScene")).define("fractalScene", ["loadedScene","maxLevel","makeCopies","makeLoop"], _fractalScene);
  main.variable(observer("makeCopies")).define("makeCopies", _makeCopies);
  main.variable(observer("makeLoop")).define("makeLoop", ["colorLevel"], _makeLoop);
  */
  return main;
}
