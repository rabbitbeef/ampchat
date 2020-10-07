import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { StackScreenProps } from '@react-navigation/stack';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import Observable from 'zen-observable-ts';
import { AuthContextValue } from '../hooks/useAuth';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import * as subscriptions from '../graphql/subscriptions';
import { TabTwoParamList } from '../types';
import {
  OnCreateMessageSubscription,
  GetRoomQueryVariables,
  CreateMessageMutationVariables,
} from '../API';
