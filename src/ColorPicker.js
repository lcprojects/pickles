import React, { createRef, Component } from 'react';

import classes from './ColorPicker.module.css';

class ColorPicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            valid: true,
            palletePickerX: '142px',
            palletePickerY: '-6px',
            huePickerX: '-6px',
            alphaPickerX: '-6px',

            hue: 0,
            saturation: 1,
            value: 0.5,
            alpha: 1,
            
            format: props.value ? props.value[0] === '#' ? 'hex' : props.value.substr(0, 3) : 'rgb',
            CSSColor: props.value ? props.value : 'rgba(255, 0, 0, 1.00)',
        }
    }
    
    pallete = createRef();
    hueBar = createRef();
    alphaBar = createRef();
    selection = createRef();

    onSelectionClick = (e) => {
        this.setState({
            open: !this.state.open
        });
    }

    pickerOk = () => {
        this.setState({ open: false });
    }

    pickerClose = (e) => {
        if (e.target !== this.selection.current && this.wrapperRef && !this.wrapperRef.contains(e.target)) {
            this.setState({ open: false })
        }
    }

    setWrapperRef = (node) => {
        this.wrapperRef = node;
    }
    
    limitPositionInsideBoundaries = (position) => {
        if (position < 0) {
            return 0
        } else if (position > 150) {
            return 150
        } else {
            return position;
        }
    }

    onPickerDown = (e) => {
        if (e.target === this.pallete.current.children[0] || e.target === this.pallete.current.children[1])
            e.preventDefault();
        
        if (e.target === this.pallete.current.children[0] || e.target === this.pallete.current.children[1]) {

            let left = e.clientX - this.pallete.current.getBoundingClientRect().left;
            let top = e.clientY - this.pallete.current.getBoundingClientRect().top;
            
            left = this.limitPositionInsideBoundaries(left);
            top = this.limitPositionInsideBoundaries(top);

            const saturation = left / 150;
            const value = (1 - top / 150);

            this.setState({
                valid: true,
                pickerClicked: true,
                palletePickerX: left - 8 + 'px',
                palletePickerY: top - 8 + 'px',
                saturation: saturation,
                value: value,
                CSSColor: this.convertToFormat(this.state.hue, saturation, value, this.state.alpha)
            });
        }
    }

    onPickerMove = (e) => {
        if (this.state.pickerClicked) {
            let left = e.clientX - this.pallete.current.getBoundingClientRect().left;
            let top = e.clientY - this.pallete.current.getBoundingClientRect().top;

            left = this.limitPositionInsideBoundaries(left);
            top = this.limitPositionInsideBoundaries(top);

            const saturation = left / 150;
            const value = (1 - top / 150);

            this.setState({
                valid: true,
                palletePickerX: left - 8 + 'px',
                palletePickerY: top - 8 + 'px',
                saturation: saturation,
                value: value,
                CSSColor: this.convertToFormat(this.state.hue, saturation, value, this.state.alpha)
            });
        }
    }

    onPickerUp = () => {
        this.setState({
            pickerClicked: false
        });
    }

    huePickerDown = (e) => {
        if (e.target === this.hueBar.current.children[0] || e.target === this.hueBar.current.children[1])
            e.preventDefault();

        if (e.target === this.hueBar.current.children[0] || e.target === this.hueBar.current.children[1]) {
            let left = e.clientX - this.hueBar.current.getBoundingClientRect().left;

            left = this.limitPositionInsideBoundaries(left);

            const hue = left / 150;

            this.setState({
                valid: true,
                huePickerClicked: true,
                huePickerX: left - 6 + 'px',
                hue: hue,
                CSSColor: this.convertToFormat(hue, this.state.saturation, this.state.value, this.state.alpha)
            });
        }
    }

    huePickerMove = (e) => {
        if (this.state.huePickerClicked) {
            let left = e.clientX - this.hueBar.current.getBoundingClientRect().left;

            left = this.limitPositionInsideBoundaries(left);

            const hue = left / 150;

            this.setState({
                valid: true,
                huePickerX: left - 6 + 'px',
                hue: hue,
                CSSColor: this.convertToFormat(hue, this.state.saturation, this.state.value, this.state.alpha)
            });
        }
    }

    huePickerUp = () => {
        this.setState({
            huePickerClicked: false
        });
    }

    alphaPickerDown = (e) => {
        if (e.target === this.hueBar.current.children[0] || e.target === this.hueBar.current.children[1])
            e.preventDefault();

        if (e.target === this.alphaBar.current.children[0] || e.target === this.alphaBar.current.children[1]) {
            let left = e.clientX - this.alphaBar.current.parentElement.getBoundingClientRect().left;

            left = this.limitPositionInsideBoundaries(left);

            const alpha = 1 - left / 150;

            this.setState({
                valid: true,
                alphaPickerClicked: true,
                alphaPickerX: left - 6 + 'px',
                alpha: alpha,
                CSSColor: this.convertToFormat(this.state.hue, this.state.saturation, this.state.value, alpha)
            });
        }
    }

    alphaPickerMove = (e) => {
        if (this.state.alphaPickerClicked) {
            let left = e.clientX - this.alphaBar.current.getBoundingClientRect().left;

            left = this.limitPositionInsideBoundaries(left);

            const alpha = 1 - left / 150;

            this.setState({
                valid: true,
                alphaPickerX: left - 6 + 'px',
                alpha: alpha,
                CSSColor: this.convertToFormat(this.state.hue, this.state.saturation, this.state.value, alpha)
            });
        }
    }

    alphaPickerUp = () => {
        this.setState({
            alphaPickerClicked: false
        });
    }

    isValidRGB = (CSSColor) => {
        let valid = 0;
        let rgbColor = CSSColor.replace('rgba(', '').replace(')', '').replace(/\s/gi, '');
        rgbColor = rgbColor.split(',');
        const r = Number(rgbColor[0]);
        const g = Number(rgbColor[1]);
        const b = Number(rgbColor[2]);
        const a = Number(rgbColor[3]) || undefined;
        if (!Number.isNaN(r) && r >= 0 && r <= 255) valid++
        if (valid && !Number.isNaN(g) && g >= 0 && g <= 255) valid++ 
        if (valid && !Number.isNaN(b) && b >= 0 && b <= 255) valid++
        if (valid && !Number.isNaN(a) && a >= 0 && a <= 1) valid++
        if (valid === 4) {
            return [r, g, b, a];
        } else {
            return [false, false, false, false];
        }
    }

    isValidHex = (CSSColor) => {
        let valid = 0;
        const hexColor = CSSColor.split('');

        if (hexColor[0] !== '#') return [false]
        if (hexColor.length > 9) return [false]

        const r = Number(Number.parseInt(hexColor[1] + hexColor[2], 16));
        const g = Number(Number.parseInt(hexColor[3] + hexColor[4], 16));
        const b = Number(Number.parseInt(hexColor[5] + hexColor[6], 16));
        let a = Number(Number.parseInt(hexColor[7] + hexColor[8], 16)) / 255;

        if (!Number.isNaN(r) && r >= 0 && r <= 255) valid++
        if (valid && !Number.isNaN(g) && g >= 0 && g <= 255) valid++ 
        if (valid && !Number.isNaN(b) && b >= 0 && b <= 255) valid++
        if ((valid && !Number.isNaN(a) && a >= 0 && a <= 1)) valid++
        if (hexColor.length === 7) {
            valid++;
            a = 1;
        }
        if (valid === 4) {
            return [r, g, b, a];
        } else {
            return [false];
        }
    }

    isValidHSL = (CSSColor) => {
        let valid = 0;
        let hslColor = CSSColor.replace('hsla(', '').replace(')', '').replace(/\s/gi, '').replace(/%/gi, '').split(',');
        const h = Number(hslColor[0]);
        const s = Number(hslColor[1]);
        const l = Number(hslColor[2]);
        const a = Number(hslColor[3]);

        if (!Number.isNaN(h) && h >= 0 && h <= 360) valid++
        if (valid && !Number.isNaN(s) && s >= 0 && s <= 100) valid++ 
        if (valid && !Number.isNaN(l) && l >= 0 && l <= 100) valid++
        if (valid && !Number.isNaN(a) && a >= 0 && a <= 1) valid++
        if (valid === 4 ) {
            return [h / 360, s / 100, l / 100, a];
        } else {
            return [false];
        }
    }

    onColorChange = (e) => {
        let r, g, b, alpha;
        let h, s, l, ahsl;
        let rhex, ghex, bhex, ahex;

        [r, g, b, alpha] = this.isValidRGB(e.target.value);
        [rhex, ghex, bhex, ahex] = this.isValidHex(e.target.value);
        [h, s, l, ahsl] = this.isValidHSL(e.target.value);
        
        if (this.state.format === 'rgb' && r !== false) {
            const [h, s, v, a] = this.RGBtoHSV(r, g, b, alpha);
            
            const palletePickerX = s * 150;
            const palletePickerY = (1 - v) * 150;
            const huePickerX = h * 150;
            const alphaPickerX = (1 - a) * 150;
            
            this.setState({
                valid: true,
                hue: h,
                saturation: s,
                value: v,
                alpha: a,
                palletePickerX: palletePickerX - 8 + 'px',
                palletePickerY: palletePickerY - 8 + 'px',
                huePickerX: huePickerX - 6 + 'px',
                alphaPickerX: alphaPickerX - 6 + 'px',
                CSSColor: e.target.value
            });
        } else if (this.state.format === 'hex' && rhex !== false) {
            const [h, s, v, a] = this.RGBtoHSV(rhex, ghex, bhex, ahex);
            
            const palletePickerX = s * 150;
            const palletePickerY = (1 - v) * 150;
            const huePickerX = Math.round(h * 150);
            const alphaPickerX = (1 - a) * 150;

            this.setState({
                valid: true,
                hue: h,
                saturation: s,
                value: v,
                alpha: a,
                palletePickerX: palletePickerX -8 + 'px',
                palletePickerY: palletePickerY - 8 + 'px',
                huePickerX: huePickerX - 6 + 'px',
                alphaPickerX: alphaPickerX - 6 + 'px',
                CSSColor: e.target.value
            });
        } else if (this.state.format === 'hsl' && h !== false) {
            const [hue, sat, val, alpha] = this.HSLToHSV(h, s, l, ahsl);

            const palletePickerX = sat * 150;
            const palletePickerY = (1 - val) * 150;
            const huePickerX = Math.round(hue * 150);
            const alphaPickerX = (1 - alpha) * 150;

            this.setState({
                valid: true,
                hue: hue,
                saturation: sat,
                value: val,
                alpha: alpha,
                palletePickerX: palletePickerX -8 + 'px',
                palletePickerY: palletePickerY - 8 + 'px',
                huePickerX: huePickerX - 6 + 'px',
                alphaPickerX: alphaPickerX - 6 + 'px',
                CSSColor: e.target.value
            });
        } else {
            this.setState({
                valid: false,
                invalidColor: e.target.value
            });
        }

        if (this.props.onColorChange) {
            this.props.onColorChange(e.target.value);
        }
    }

    toRGB = (h, s, v, alpha) => {
        const hue = Math.round(h * 360);

        const c = v * s;
        const x = c * (1 - Math.abs(((hue/60) % 2) - 1));
        const m = v - c;
        
        let r1, g1, b1;
        let r, g, b;

        if (hue >= 0 && hue < 60) {
            r1 = c;
            g1 = x;
            b1 = 0;
        } else if (hue >= 60 && hue < 120) {
            r1 = x;
            g1 = c;
            b1 = 0;
        } else if (hue >= 120 && hue < 180) {
            r1 = 0;
            g1 = c;
            b1 = x;
        } else if (hue >= 180 && hue < 240) {
            r1 = 0;
            g1 = x;
            b1 = c;
        } else if (hue >= 240 && hue < 300) {
            r1 = x;
            g1 = 0;
            b1 = c;
        } else if (hue >= 300 && hue < 360) {
            r1 = c;
            g1 = 0;
            b1 = x;
        }
        
        r = (r1 + m);
        g = (g1 + m);
        b = (b1 + m);

        return [r, g, b, alpha];
    }

    toHEX = (h, s, v, alpha) => {
        let [r, g, b] = this.toRGB(h, s, v, alpha);
        
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);

        if (this.state.alpha !== 1) {
            alpha = Math.trunc(Number(this.state.alpha.toFixed(2)) * 255).toString(16)
        } else {
            alpha = '';
        }

        let hexColor = r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0') + alpha;
        return hexColor;
    }

    toHSL = (h, s, v, alpha) => {
        let sat;
        const lig = v * ( 1 - s / 2);

        if (lig === 0 || lig === 1) {
            sat = 0;
        } else {
            sat = (v - lig) / (Math.min(lig, 1 - lig));
        }

        return [h, sat, lig, alpha];
    }

    RGBtoHSV =  (r, g, b, a) => {
        let h, s, v, alpha = a;
        let min, max, delta;

        min = r < g ? r : g;
        min = min  < b ? min  : b;

        max = r > g ? r : g;
        max = max  > b ? max  : b;

        v = max / 255;
        delta = max - min;
        if (delta < 0.00001)
        {
            s = 0;
            h = 0;
            return [h, s, v, alpha];
        }
        if( max > 0.0 ) {
            s = (delta / max);
        } else {
            s = 0.0;
            h = undefined;
            return [h, s, v, alpha];
        }
        if( r >= max )
            h = ( g - b ) / delta;
        else
        if( g >= max )
            h = 2.0 + ( b - r ) / delta;
        else
            h = 4.0 + ( r - g ) / delta;

        h *= 60.0;

        if( h < 0.0 )
            h += 360.0;

        h /= 360;
        return [h, s, v, alpha]
    }

    HSLToHSV = (h, s, l, a) => {
        const v = l + s * Math.min(l, 1 - l);
        
        s = v === 0 ? 0 : 2 * ( 1 - l / v);

        return [h, s, v, a]
    }

    convertToFormat = (h, s, v, alpha) => {
        let color = '';
        if (this.state.format === 'rgb') {
            const [red, green, blue] = this.toRGB(h, s, v, alpha)
            color = `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${alpha.toFixed(2)})`;
        } else if (this.state.format === 'hex') {
            color = '#' + this.toHEX(h, s, v, alpha);
        } else {
            const [hue, saturation, lightness] = this.toHSL(h, s, v, alpha)
            color = `hsla(${Math.round(hue * 360)}, ${Math.round(saturation * 100) + '%'}, ${Math.round(lightness * 100) + '%'}, ${alpha.toFixed(2)})`;
        }
        if (this.props.onColorChange) {
            this.props.onColorChange(color);
        }
        return color;
    }

    changeFormat = () => {
        this.setState({
            format: this.state.format === 'rgb' ? 'hex' : this.state.format === 'hex' ? 'hsl' : 'rgb'
        }, () => {this.setState({ valid: true, CSSColor: this.convertToFormat(this.state.hue, this.state.saturation, this.state.value, this.state.alpha)})});
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.onPickerDown);
        window.addEventListener('mousemove', this.onPickerMove);
        window.addEventListener('mouseup', this.onPickerUp);

        window.addEventListener('mousedown', this.huePickerDown);
        window.addEventListener('mousemove', this.huePickerMove);
        window.addEventListener('mouseup', this.huePickerUp);

        window.addEventListener('mousedown', this.alphaPickerDown);
        window.addEventListener('mousemove', this.alphaPickerMove);
        window.addEventListener('mouseup', this.alphaPickerUp);

        window.addEventListener('click', this.pickerClose);

        if (this.props.value) {
            this.onColorChange({ target: { value: this.props.value } });

        }
    }

    componentWillUnmount () {
        window.removeEventListener('mousedown', this.onPickerDown);
        window.removeEventListener('mousemove', this.onPickerMove);
        window.removeEventListener('mouseup', this.onPickerUp);

        window.removeEventListener('mousedown', this.huePickerDown);
        window.removeEventListener('mousemove', this.huePickerMove);
        window.removeEventListener('mouseup', this.huePickerUp);

        window.removeEventListener('mousedown', this.alphaPickerDown);
        window.removeEventListener('mousemove', this.alphaPickerMove);
        window.removeEventListener('mouseup', this.alphaPickerUp);
    }

    render() {
        const picklesStyle = {
            display: this.state.open ? 'block' : 'none'
        }
        
        const selectionStyle = {
            backgroundColor: this.state.CSSColor
        }

        const palleteStyle = {
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, ${this.state.alpha.toFixed(2)}), transparent), linear-gradient(to left, hsla(${Math.round(this.state.hue * 360)}, 100%, 50%, ${this.state.alpha.toFixed(2)}), rgba(255, 255, 255, ${this.state.alpha.toFixed(2)}))`
        }

        const pickerStyle = {
            top: this.state.palletePickerY,
            left: this.state.palletePickerX,
            backgroundColor: this.state.CSSColor
        }
        
        const huePickerStyle = {
            left: this.state.huePickerX,
            backgroundColor: `hsl(${Math.round(this.state.hue * 360)}, 100%, 50%)`
        }

        const alphaPickerStyle = {
            left: this.state.alphaPickerX,
            backgroundColor: this.state.CSSColor
        }

        const alphaStyle = {
            backgroundImage: `linear-gradient(to left, transparent, ${this.state.CSSColor.replace(/,[\s\d.]+\)/, ', 1)')})`
        }

        let color;
        if (this.state.valid === false) {
            color = this.state.invalidColor;
        } else {
            color = this.state.CSSColor;
        }

        let PickerPosition = this.props.position ? ' ' + classes[this.props.position] : ' ' + classes.bottomRight;

        return (
            <div className={classes.Wrapper}>
                <div className={classes.Selection} style={selectionStyle} ref={this.selection} onClick={this.onSelectionClick}></div>
                <div className={classes.Pickles + PickerPosition} style={picklesStyle} ref={this.setWrapperRef}>
                    <div className={classes.PalleteContainer} ref={this.pallete}>
                        <div className={classes.Pallete} style={palleteStyle}></div>
                        <div className={classes.Picker} style={pickerStyle}></div>
                    </div>
                    <div className={classes.HueContainer} ref={this.hueBar}>
                        <div className={classes.Hue}></div>
                        <div className={classes.HuePicker} style={huePickerStyle}></div>
                    </div>
                    <div className={classes.AlphaContainer} ref={this.alphaBar}>
                        <div className={classes.Alpha} style={alphaStyle}></div>
                        <div className={classes.AlphaPicker} style={alphaPickerStyle}></div>
                    </div>
                    <div className={classes.ControlsContainer}>
                        <input type="text" className={classes.Value} value={color} onChange={this.onColorChange}/>
                        <button className={classes.Format} onClick={this.changeFormat}>{this.state.format}</button>
                    </div>
                    <div className={classes.AlignRight}>
                        <button className={classes.Set} onClick={this.pickerOk}>OK</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ColorPicker;