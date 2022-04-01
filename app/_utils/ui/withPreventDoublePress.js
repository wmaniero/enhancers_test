import React from 'react';
import { debounce } from 'lodash/function';

const withPreventDoublePress = (WrappedComponent) => {
	class PreventDoublePress extends React.PureComponent {
		debouncedOnPress = () => {
            this.props.onPress && this.props.onPress();
		};

		onPress = debounce(this.debouncedOnPress, 50, {
			leading: true,
			trailing: false,
		});

		render() {
			return <WrappedComponent {...this.props} onPress={this.onPress} />;
		}
	}

	PreventDoublePress.displayName = `withPreventDoublePress(${
		WrappedComponent.displayName || WrappedComponent.name
	})`;
	return PreventDoublePress;
};

export { withPreventDoublePress as withPreventDoublePress };