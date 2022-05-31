export default function Colortools({ onClickColor, pencilWidth, onSlide }) {
    return (
        <div className="color-picker-div">
            <div className="top-colors">
                <div
                    onClick={onClickColor}
                    className="colors red"
                    id="red"
                ></div>
                <div
                    onClick={onClickColor}
                    className="colors green"
                    id="green"
                ></div>
                <div
                    onClick={onClickColor}
                    className="colors brown"
                    id="brown"
                ></div>
                <div
                    onClick={onClickColor}
                    className="colors yellow"
                    id="yellow"
                ></div>
            </div>
            <div className="bottom-colors">
                <div
                    onClick={onClickColor}
                    className="colors black"
                    id="black"
                ></div>
                <div
                    onClick={onClickColor}
                    className="colors pink"
                    id="hotpink"
                ></div>
                <div
                    onClick={onClickColor}
                    className="colors blue"
                    id="blue"
                ></div>
                <div
                    onClick={onClickColor}
                    className="colors orange"
                    id="orange"
                ></div>
            </div>
            <div className="pencil-div">
                <input
                    className="color-width-input"
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={pencilWidth}
                    onChange={onSlide}
                ></input>
                <div
                    className="sizeable-dot"
                    style={{
                        width: `${pencilWidth * 1.5}px`,
                        height: `${pencilWidth * 1.5}px`,
                    }}
                ></div>
            </div>
        </div>
    );
}
