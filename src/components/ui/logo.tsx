import { ScrollView, Image } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';

const ParishLogo = () => {
  const tailwind = useTailwind();
  return (
    <ScrollView>
        <Image style={tailwind('max-w-8 mr-2')} source={require('../../../public/Parishus logo.png')} alt="Parish Logo" />
    </ScrollView>
  )
}

export default ParishLogo
