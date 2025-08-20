import { View, Image } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';

const ParishLogo = () => {
  const tailwind = useTailwind();
  return (
    <View>
        <Image style={tailwind('max-w-8 mr-2')} source={require('../../../public/Parishus logo.png')} alt="Parish Logo" />
    </View>
  )
}

export default ParishLogo
