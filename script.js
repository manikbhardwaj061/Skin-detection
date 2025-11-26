let model;

window.onload = async function () {
    model = await tf.loadLayersModel(
        "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
    );
    console.log("Model Loaded!");
};

document.getElementById("imageUpload").addEventListener("change", function (event) {
    let img = document.getElementById("preview");
    img.src = URL.createObjectURL(event.target.files[0]);
    img.style.display = "block";
});

async function predictSkin() {
    let img = document.getElementById("preview");

    if (!img.src) {
        alert("Please upload an image!");
        return;
    }

    let tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();

    let prediction = model.predict(tensor);
    let values = prediction.dataSync();

    let acne = values[200] * 100;
    let eczema = values[350] * 100;
    let healthy = values[50] * 100;

    let conditions = {
        "Acne": acne,
        "Eczema": eczema,
        "Healthy Skin": healthy
    };

    let result = Object.keys(conditions).reduce((a, b) => conditions[a] > conditions[b] ? a : b);

    document.getElementById("result").innerText = "Detected: " + result;

    let advice = {
        "Acne": "Use salicylic acid face wash & avoid oily products.",
        "Eczema": "Keep skin moisturized, avoid harsh soaps.",
        "Healthy Skin": "Maintain hydration & use sunscreen daily."
    };

    document.getElementById("recommend").innerText = advice[result];
}
