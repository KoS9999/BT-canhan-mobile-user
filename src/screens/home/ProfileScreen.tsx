import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
}

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
  });

  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [otpCurrentEmail, setOtpCurrentEmail] = useState<string>('');
  const [otpNewEmail, setOtpNewEmail] = useState<string>('');
  const [otpFromEmail, setOtpFromEmail] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
      });
      setUser(response.data.user);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng.');
    }
  };

  const updateEmail = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/update-email',
        {
          newEmail,
          otpFromCurrentEmail: otpCurrentEmail,
          otpFromNewEmail: otpNewEmail,
        },
        {
          headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
        }
      );
      Alert.alert('Thành công', response.data.message);
      fetchUserProfile();
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật email.');
    }
  };

  const updatePhone = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/update-phone',
        {
          newPhone,
          otpFromEmail,
        },
        {
          headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
        }
      );
      Alert.alert('Thành công', response.data.message);
      fetchUserProfile();
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật số điện thoại.');
    }
  };

  const updateProfile = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/user/update-profile',
        {
          name: user.name,
          address: user.address,
        },
        {
          headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
        }
      );
      Alert.alert('Thành công', 'Thông tin người dùng đã được cập nhật.');
      fetchUserProfile();
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật thông tin người dùng.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      uploadProfileImage(result.assets[0].uri);
    }
  };

  const uploadProfileImage = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const response = await axios.post('http://localhost:5000/api/user/update-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        },
      });
      Alert.alert('Thành công', response.data.message);
      fetchUserProfile();
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật ảnh đại diện.');
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text>Họ và tên:</Text>
      <TextInput
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
        placeholder="Họ và tên"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Email:</Text>
      <TextInput value={user.email} editable={false} style={{ borderBottomWidth: 1, marginBottom: 10 }} />

      <Text>Số điện thoại:</Text>
      <TextInput
        value={newPhone}
        onChangeText={(text) => setNewPhone(text)}
        placeholder="Số điện thoại mới"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Địa chỉ:</Text>
      <TextInput
        value={user.address}
        onChangeText={(text) => setUser({ ...user, address: text })}
        placeholder="Địa chỉ"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      {user.profileImage && (
        <Image source={{ uri: user.profileImage }} style={{ width: 100, height: 100, marginBottom: 10 }} />
      )}
      <Button title="Chọn ảnh đại diện" onPress={pickImage} />

      <Button title="Cập nhật thông tin" onPress={updateProfile} />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Cập nhật email:</Text>
      <TextInput
        value={newEmail}
        onChangeText={(text) => setNewEmail(text)}
        placeholder="Email mới"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        value={otpCurrentEmail}
        onChangeText={(text) => setOtpCurrentEmail(text)}
        placeholder="OTP từ email cũ"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        value={otpNewEmail}
        onChangeText={(text) => setOtpNewEmail(text)}
        placeholder="OTP từ email mới"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Cập nhật email" onPress={updateEmail} />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Cập nhật số điện thoại:</Text>
      <TextInput
        value={otpFromEmail}
        onChangeText={(text) => setOtpFromEmail(text)}
        placeholder="OTP từ email"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Cập nhật số điện thoại" onPress={updatePhone} />
    </ScrollView>
  );
};

export default ProfileScreen;
