import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { HomeStackParamList } from '../../navigation/types';
import { createItem, updateItem, getItemById, uploadItemImage } from '../../api/itemsApi';
import { ItemCategory } from '../../types/item.types';
import { ITEM_CATEGORIES, BASE_URL } from '../../utils/constants';

type Props = NativeStackScreenProps<HomeStackParamList, 'CreateListing'>;

const CreateListingScreen: React.FC<Props> = ({ navigation, route }) => {
  const itemId = route.params?.itemId;
  const isEditMode = !!itemId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory | null>(null);
  const [dailyPrice, setDailyPrice] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]); // local URIs to upload
  const [existingImages, setExistingImages] = useState<{ id: string; imageUrl: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && itemId) {
      const fetchItem = async () => {
        try {
          const item = await getItemById(itemId);
          setTitle(item.title);
          setDescription(item.description);
          setCategory(item.category);
          setDailyPrice(item.dailyPrice.toString());
          setExistingImages(
            item.images?.map(img => ({ id: img.id, imageUrl: img.imageUrl })) || []
          );
        } catch {
          Alert.alert('Error', 'Failed to load item');
          navigation.goBack();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchItem();
    }
  }, [itemId]);

  const validate = (): boolean => {
    const tErr = !title.trim() ? 'Title is required' : null;
    const dErr = !description.trim() ? 'Description is required' : null;
    const cErr = !category ? 'Please select a category' : null;
    const pErr =
      !dailyPrice || isNaN(Number(dailyPrice)) || Number(dailyPrice) <= 0
        ? 'Enter a valid price'
        : null;

    setTitleError(tErr);
    setDescError(dErr);
    setCategoryError(cErr);
    setPriceError(pErr);

    return !tErr && !dErr && !cErr && !pErr;
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      const totalCount = existingImages.length + newImages.length + uris.length;
      if (totalCount > 5) {
        Alert.alert('Limit Reached', 'You can have up to 5 photos total');
        return;
      }
      setNewImages(prev => [...prev, ...uris]);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      let savedItemId: string;

      if (isEditMode && itemId) {
        await updateItem(itemId, {
          title: title.trim(),
          description: description.trim(),
          category: category!,
          dailyPrice: Number(dailyPrice),
        });
        savedItemId = itemId;
      } else {
        const created = await createItem({
          title: title.trim(),
          description: description.trim(),
          category: category!,
          dailyPrice: Number(dailyPrice),
        });
        savedItemId = created.id;
      }

      // Upload any newly picked images
      for (const uri of newImages) {
        await uploadItemImage(savedItemId, uri);
      }

      Alert.alert(
        'Success',
        isEditMode ? 'Your listing has been updated!' : 'Your item has been listed!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      Alert.alert(
        'Failed',
        err?.response?.data?.message || 'Could not save listing'
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Listing' : 'New Listing'}
          </Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Title */}
        <Text style={styles.label}>Item Title</Text>
        <TextInput
          style={[styles.input, titleError ? styles.inputError : null]}
          placeholder="e.g. Canon DSLR Camera"
          placeholderTextColor="#666"
          value={title}
          onChangeText={text => { setTitle(text); setTitleError(null); }}
        />
        {titleError && <Text style={styles.errorText}>{titleError}</Text>}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, descError ? styles.inputError : null]}
          placeholder="Describe your item, condition, what's included..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={text => { setDescription(text); setDescError(null); }}
        />
        {descError && <Text style={styles.errorText}>{descError}</Text>}

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {ITEM_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat ? styles.categoryChipActive : null,
              ]}
              onPress={() => { setCategory(cat); setCategoryError(null); }}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  category === cat ? styles.categoryChipTextActive : null,
                ]}
              >
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {categoryError && <Text style={styles.errorText}>{categoryError}</Text>}

        {/* Price */}
        <Text style={styles.label}>Daily Price (GH₵)</Text>
        <TextInput
          style={[styles.input, priceError ? styles.inputError : null]}
          placeholder="e.g. 50"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={dailyPrice}
          onChangeText={text => { setDailyPrice(text); setPriceError(null); }}
        />
        {priceError && <Text style={styles.errorText}>{priceError}</Text>}

        {/* Existing Images (Edit Mode) */}
        {existingImages.length > 0 && (
          <>
            <Text style={styles.label}>Current Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewRow}>
              {existingImages.map(img => (
                <View key={img.id} style={styles.imagePreviewContainer}>
                  <Image source={{ uri: `${BASE_URL}${img.imageUrl}` }} style={styles.imagePreview} />
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* New Images */}
        <Text style={styles.label}>
          {isEditMode ? 'Add More Photos' : 'Photos (up to 5)'}
        </Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
          <Text style={styles.imagePickerText}>+ Add Photos</Text>
        </TouchableOpacity>

        {newImages.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewRow}>
            {newImages.map((uri, index) => (
              <View key={index} style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => setNewImages(prev => prev.filter((_, i) => i !== index))}
                >
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, loading ? styles.submitButtonDisabled : null]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditMode ? 'Save Changes' : 'Post Listing'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    color: '#e94560',
    fontSize: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    color: '#a0a0b0',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#e94560',
  },
  errorText: {
    color: '#e94560',
    fontSize: 12,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  categoryChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  categoryChipText: {
    color: '#a0a0b0',
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: '#0f3460',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  imagePickerText: {
    color: '#a0a0b0',
    fontSize: 14,
  },
  imagePreviewRow: {
    marginTop: 12,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#e94560',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateListingScreen;