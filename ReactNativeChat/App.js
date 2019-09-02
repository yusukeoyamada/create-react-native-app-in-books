/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import Channel from './Channel';
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';

export default class App extends Component<{}> {
  channels: Array<string>;
  _AppDrawerNavigator: any;

  constructor(props) {
    super(props);
    this.channels = ['general', 'random'];

    let drawerMenus: any = new Object();
    this.channels.forEach(channelName => {
      Object.assign(drawerMenus, {
        [channelName]: this.createDrawerMenu(channelName),
      });
    });
    this._AppDrawerNavigator = createDrawerNavigator(drawerMenus);
  }

  createDrawerMenu(channelName: string) {
    return {
      screen: createStackNavigator(
        {
          Home: {
            screen: Channel,
          },
        },
        {
          initialRouteParams: {
            channelName: channelName,
          },
        },
      ),
      navigationOptions: {
        drawerLabel: `#${channelName}`,
      },
    };
  }

  render() {
    const ChannelContainer: any = createAppContainer(this._AppDrawerNavigator);
    return <ChannelContainer />;
  }
}
