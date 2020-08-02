var canvas = document.getElementById('renderCanvas');
canvas.width = "800";
canvas.height = "600";
// Load the 3D engine
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
// CreateScene function that creates and return the scene
var skeletonsContainer = null;
var mesh = null;
var originalPos = null;

class Joints {
    constructor() {
        this.data = {
            'rightShoulder': 0,
            'rightElbow': 0,
            'leftShoulder': 0,
            'leftElbow': 0,
            'head': {
                'x': 0,
                'y': 0
            }
        }
    }
    update(joint, val) {
        this.data[joint] = val;
    }
    get(joint) {
        return this.data[joint];
    }
}

var createScene = function() {
        var joints = new Joints();
        // Create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);
        // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 40, 120), scene);
        // Target the camera to scene origin
        camera.setTarget(new BABYLON.Vector3(0, 40, 0));
        // Attach the camera to the canvas
        camera.attachControl(canvas, false);
        // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
        // var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
        // Move the sphere upward 1/2 of its height
        // sphere.position.y = 1;
        // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
        var ground = BABYLON.Mesh.CreateGround('ground1', 50, 50, 2, scene, false);
        // Return the created scene
        BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/BabylonJS/Website/master/Scenes/Dude/", "Dude.babylon", scene, function(newMeshes, particleSystems, skeletons) {
            var dude = newMeshes[0];
            var mesh = newMeshes[0];

            dude.rotation.y = 0;
            dude.position = new BABYLON.Vector3(0, 0, 0);

            /*
            0 - main
    
            4 - femur
            5 - spine
            6 - chest 
            7 - neck

            13 - left arm
            14 - left elbow
            15 - left hand

            32 - right arm
            33 - right elbow
            34 - right hand

            50 - left arm
            51 - left elbow
            52 - left hand

            54 - left arm
            55 - left elbow
            56 - left hand
            */

            const bone = skeletons[0].bones[0];
            skeletonsContainer = skeletons[0];


            const head_bone = skeletonsContainer.bones[7];
            const right_shoulder_bone = skeletonsContainer.bones[13];
            const right_arm_bone = skeletonsContainer.bones[14];
            const left_shoulder_bone = skeletonsContainer.bones[32];
            const left_arm_bone = skeletonsContainer.bones[33];
            console.log(
                joints,
                right_shoulder_bone,
                right_arm_bone,
                left_shoulder_bone,
                left_arm_bone
            );
            right_shoulder_bone.rotation = new BABYLON.Vector3(0, 1.5 * joints.data.rightShoulder, 0);
            right_arm_bone.rotation = new BABYLON.Vector3(0, joints.data.rightElbow, 0);
            left_shoulder_bone.rotation = new BABYLON.Vector3(0, -1.5 * joints.data.leftShoulder, 0);
            left_arm_bone.rotation = new BABYLON.Vector3(0, -1 * joints.data.leftElbow, 0);

            var canvas = document.getElementById('renderCanvas');
            canvas.width = "600";
            canvas.height = "400";
            originalPos = [...Array(58).keys()].map((boneId) => skeletonsContainer.bones[boneId].getPosition(BABYLON.Space.WORLD, mesh));
            // console.log(originalPos);
        });

        return scene;
    }
    // call the createScene function
var scene = createScene();
// run the render loop
engine.runRenderLoop(function() {
    scene.render();
});
// the canvas/window resize event handler
window.addEventListener('resize', function() {
    engine.resize();
});

function moveBone() {
    console.log(originalPos);
    [...Array(58).keys()].map((boneId) => skeletonsContainer.bones[boneId].setPosition(new BABYLON.Vector3(0, 0, 0), mesh));
    // console.log("OnChange",skeletonsContainer);

    var boneId = document.getElementById("selectObj").value;
    console.log(skeletonsContainer.bones[boneId].getPosition(BABYLON.Space.WORLD, mesh));
    // skeletonsContainer.bones[boneId].translate(5, 0, 0 , BABYLON.Space.WORLD, mesh);
    skeletonsContainer.bones[boneId].setPosition(new BABYLON.Vector3(0, 0, 0), BABYLON.Space.WORLD, mesh);;
}

var testPose = JSON.parse('[{"score":0.999281108379364,"part":"nose","position":{"x":527.0821818488492,"y":244.36689555316892}},{"score":0.9992807507514954,"part":"leftEye","position":{"x":549.6420883661765,"y":219.31667271885303}},{"score":0.9985756874084473,"part":"rightEye","position":{"x":504.0329719415591,"y":220.39230927633582}},{"score":0.9734774827957153,"part":"leftEar","position":{"x":580.7549103181012,"y":238.9019329526009}},{"score":0.8534235954284668,"part":"rightEar","position":{"x":478.0189645436889,"y":231.39363833086207}},{"score":0.9209240674972534,"part":"leftShoulder","position":{"x":621.445323865951,"y":359.5328496530515}},{"score":0.9095295071601868,"part":"rightShoulder","position":{"x":430.76436866461904,"y":355.6733600021502}},{"score":0.8848628401756287,"part":"leftElbow","position":{"x":797.2983401847287,"y":257.6284597554338}},{"score":0.8198176622390747,"part":"rightElbow","position":{"x":270.9021449026893,"y":255.58610226692412}},{"score":0.5830729007720947,"part":"leftWrist","position":{"x":790.203471661502,"y":83.67530014318064}},{"score":0.6830629110336304,"part":"rightWrist","position":{"x":246.778038919971,"y":94.59066922948995}},{"score":0.795782208442688,"part":"leftHip","position":{"x":619.9911977529971,"y":677.9089884626757}},{"score":0.6898073554039001,"part":"rightHip","position":{"x":465.49648576164606,"y":693.8590253077516}},{"score":0.520266056060791,"part":"leftKnee","position":{"x":862.6004630715711,"y":771.8964451781106}},{"score":0.6110744476318359,"part":"rightKnee","position":{"x":208.4065325859539,"y":766.4853448430333}},{"score":0.8120326995849609,"part":"leftAnkle","position":{"x":933.3550075197132,"y":1026.157337713679}},{"score":0.8203750848770142,"part":"rightAnkle","position":{"x":149.65157637782605,"y":1026.1098795199614}}]');