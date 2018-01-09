import ReactDOM from 'react-dom';
import React from 'react';
import './base.css';
import './func.less';

export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date()
		};
		this.showCal = this.showCal.bind(this);
	}

	setUIState(key, val) {
		console.log(`set ${key}: ${val}`);
		var state = this.state;
		state[key] = val;
		this.setState(state);
	}

	showCal() {
		this.calInput.click();
	}

	render() {
		return (<div>
			<input className='display_none' type='date' ref={(ref) => {this.calInput = ref;}}
				onChange={(ev) => this.setUIState('date', ev.target.value)}/>
			<br/>
			{this.state.date.toString()}
			<button onClick={this.showCal}>Show Cal</button>
		</div>);
	}
}

var holder = document.createElement('div');
document.body.appendChild(holder);
ReactDOM.render((<App/>), holder);
