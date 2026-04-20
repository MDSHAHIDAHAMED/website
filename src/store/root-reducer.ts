import accreditationSlice from '@/store/slices/accreditation-slice';
import coingeckoSlice from '@/store/slices/coingecko-slice';
import deviceSlice from '@/store/slices/device-slice';
import notificationReducer from '@/store/slices/notification-slice';
import onrampSlice from '@/store/slices/onramp-slice';
import passkeySlice from '@/store/slices/passkey-slice';
import portfolioSlice from '@/store/slices/portfolio-slice';
import userSlice from '@/store/slices/user-slice';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    accreditation: accreditationSlice,
    coingecko: coingeckoSlice,
    device: deviceSlice,
    passkey: passkeySlice,
    user: userSlice,
    portfolio: portfolioSlice,
    notification: notificationReducer,
    onramp: onrampSlice,
});

export type RootReducersState = ReturnType<typeof rootReducer>;
export default rootReducer;
