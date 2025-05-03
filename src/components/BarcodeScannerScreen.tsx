import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackList } from '@/navigation/navigationType';
import CustomView from './CustomView';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from './share/BackButton';
import Spinner from './Spinner';

type Props = NativeStackScreenProps<HomeStackList>;
export default function BarcodeScannerScreen({navigation}: Props) {
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);

  const [scannedData, setScannedData] = useState<string | null>(null); // Store scanned parcel ID
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission) return;

    if (!permission.granted) {
      requestPermission(); // Ask for permission if not granted
    }
  }, [permission]);
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setLoading(true); // start showing loader
    try {
      setScannedData(data);
      console.log('Scanned Barcode:', data);
      await AsyncStorage.setItem('scannedParcelID', data);
    //   navigation.navigate('ScreenOneParcelInDriverPreview');
    } catch (error) {
      console.error('Error handling scanned barcode', error);
    } finally {
      setLoading(false); // stop loader
    }
  };
  
  useEffect(() => {
    // Fetch the parcel ID from AsyncStorage on initial load
    const fetchParcelID = async () => {
      const savedParcelID = await AsyncStorage.getItem('scannedParcelID');
      if (savedParcelID) {
        setScannedData(savedParcelID);
      }
    };

    fetchParcelID();
  }, []);

  if (!permission) {
    return <View />; // Permissions are still loading
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <CustomView style={{paddingVertical: RFValue(10)}} padded>
        <BackButton onClick={() => navigation.goBack()} />
        {loading && (
        <Spinner
          message={`Processing your Parcel Please wait.....`}
          width={'65%'}
          height={200}
        />
      )}
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned} // Disable scanning if already scanned
        
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {scannedData && (
        <View style={styles.scannedDataContainer}>
          <Text style={styles.scannedText}>Parcel ID: {scannedData}</Text>
          <TouchableOpacity onPress={() => setScannedData(null)}>
            <Text style={styles.text}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </CustomView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scannedDataContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  scannedText: {
    fontSize: 18,
    color: 'white',
  },
});
