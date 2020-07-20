import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import {Tooltip} from 'react-native-elements';

import * as appActions from '../../store/actions/appActions';
import {MaterialIndicator} from 'react-native-indicators';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
    : Math.sign(num) * Math.abs(num);
}

const Earnings = (props) => {
  const dispatch = useDispatch();
  const [chart_data, setChart_data] = useState([0, 0, 0, 0, 0, 0, 0]);

  const user = useSelector((state) => state.authReducer.user);
  const earnings = useSelector((state) => state.appReducer.earnings);

  const start_of_week = Moment().startOf('isoWeek');
  const end_of_week = Moment().endOf('isoWeek');

  //console.log(start_of_week);

  const start = Moment(start_of_week).format('MMM DD');
  const end = Moment(end_of_week).format('MMM DD');

  useEffect(() => {
    const getEarnings = async () => {
      await dispatch(
        appActions.getEarnings(
          user._id,
          new Date(start_of_week),
          new Date(end_of_week),
        ),
      );
      const response = await appActions.fetchSellerWeeklyGraphData(
        user._id,
        new Date(start_of_week),
        new Date(end_of_week),
      );
      setChart_data(response.newArr);
    };
    getEarnings();
  }, []);

  let weekly_earnings;
  if (earnings.total_earned_per_week === undefined) {
    weekly_earnings = (
      <MaterialIndicator color={Colors.purple_darken} size={25} />
    );
  } else {
    weekly_earnings = (
      <View>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 30,
              lineHeight: 65,
            }}>
            $
          </Text>
          <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 100}}>
            {kFormatter(earnings.total_earned_per_week.split('.')[0])}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 35,
              lineHeight: 80,
            }}>
            .{earnings.total_earned_per_week.split('.')[1]}
          </Text>
        </View>

        <View>
          <LineChart
            data={{
              datasets: [
                {
                  data: chart_data,
                },
              ],
            }}
            width={Dimensions.get('window').width - 50} // from react-native
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => Colors.purple_darken,
              labelColor: (opacity = 1) => `#000`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: Colors.purple_darken,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </View>
    );
  }

  let textToRender;
  if (earnings.available_balance === undefined) {
    textToRender = <MaterialIndicator color="#fff" size={25} />;
  } else {
    textToRender = (
      <Text
        style={{
          fontFamily: Fonts.poppins_semibold,
          fontSize: 19,
          color: '#fff',
          textAlign: 'center',
        }}>
        Available Cash $
        {numberWithCommas(parseFloat(earnings.available_balance).toFixed(2))}
      </Text>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 15}}>
        {start} - {end}
      </Text>
      {weekly_earnings}

      <View
        style={{
          backgroundColor: Colors.purple_darken,
          padding: 20,
          borderRadius: 100,
          width: '85%',
        }}>
        {textToRender}
      </View>

      <View
        style={{
          borderTopWidth: 0.5,
          width: '100%',
          marginTop: 20,
          borderTopColor: Colors.light_grey,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate('SellerWeeklyActivity');
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 14,
                paddingTop: 15,
              }}>
              Weekly activity
            </Text>
            <View style={{marginTop: 14, marginLeft: 10}}>
              <Icon name="md-arrow-round-forward" size={20} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
});

export default Earnings;
