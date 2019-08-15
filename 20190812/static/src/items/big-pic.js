import Component from "./component";
export default class BigPic extends Component {
	constructor (props) {
		super(props);
	}

	render () {
		const {data} = this.props;
		return `
		<div class="item big-pic">
                <img src="${data.imageList[0]}" />	
            </div>`;
	}
}