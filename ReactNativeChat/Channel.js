/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import {type NavigationScreenProp} from 'react-navigation';

const baseURL =
  'https://us-central1-chatapplication-b9539.cloudfunctions.net/v1';

type MessageCellProps = {
  message: Message,
};

const MessageCell = (props: MessageCellProps) => {
  return (
    <View style={styles.message}>
      <Image
        style={styles.messageUserAvator}
        source={
          props.message.user.avator || require('./images/avator_blank.png')
        }
      />
      <View style={styles.messageText}>
        <View style={styles.messageAbout}>
          <Text style={styles.messageUser}>{props.message.user.name}</Text>
          <Text style={styles.messageDate}>{props.message.date}</Text>
        </View>
        <Text style={styles.messageBody}>{props.message.body}</Text>
      </View>
    </View>
  );
};

type Message = {
  id: string,
  body: string,
  user: {
    id: string,
    name: string,
    avatar: string,
  },
  date: string,
};

type PostMessage = {
  body: string,
};

type State = {
  messages: Array<Message>,
  messageBody: string,
};

type Props = {
  navigation: NavigationScreenProp<*>,
};

export default class Channel extends Component<Props, State> {
  static navigationOptions = ({navigation}: Props) => ({
    title: `#${navigation.state.params.channelName}`,
    headerLeft: (
      <TouchableOpacity
        style={{padding: 8}}
        onPress={() => navigation.toggleDrawer()}>
        <Image
          style={{width: 32, height: 32}}
          source={require('./images/menu_icon.png')}
        />
      </TouchableOpacity>
    ),
  });

  getEndPointURL(): string {
    const {channelName} = this.props.navigation.state.params;
    return `${baseURL}/channels/${channelName}/messages`;
  }

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messageBody: '',
    };
  }

  componentDidMount() {
    this.fetchMessages();
  }

  fetchMessages() {
    fetch(this.getEndPointURL())
      .then(response => response.json())
      .then(json => this.setState({messages: json.messages}))
      .catch(error => console.log(error));
  }

  postMessage() {
    const payload: PostMessage = {body: this.state.messageBody};
    fetch(this.getEndPointURL(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        this.fetchMessages();
        this.setState({messageBody: ''});
      })
      .catch(error => console.log(error));
  }

  render() {
    console.log(this.props);
    const {channelName} = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={styles.action}>
          <TextInput
            style={styles.actionTextInput}
            placeholder={`Message #${channelName}`}
            onChangeText={text => this.setState({messageBody: text})}
            value={this.state.messageBody}
          />
          <Button
            title="Send"
            onPress={() => this.postMessage()}
            disabled={this.state.messageBody.length === 0}
          />
        </View>
        <FlatList
          style={styles.list}
          data={this.state.messages.slice().reverse()}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => {
            return <MessageCell message={item} />;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  list: {
    flex: 1,
  },
  message: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    height: 72,
    paddingTop: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  messageUserAvator: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  messageText: {
    flex: 1,
  },
  messageAbout: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 2,
  },
  messageUser: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageDate: {
    marginLeft: 8,
    fontSize: 12,
    color: 'grey',
  },
  messageBody: {
    fontSize: 14,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  actionTextInput: {
    flex: 1,
    paddingLeft: 16,
  },
});