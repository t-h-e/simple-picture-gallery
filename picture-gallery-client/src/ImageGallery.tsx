import {useState, useEffect} from "react";

function ImageGallery() {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/images")
            .then((res) => res.json())
            .then((data) => setImages(data.images));
    }, []);

    return (
        <div>
            {images.map(image => {
                return (<img src={image} alt={"dog"}/>)
            })}
        </div>
    );
}

export default ImageGallery;
