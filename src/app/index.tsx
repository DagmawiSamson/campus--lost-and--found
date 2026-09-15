import { useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Item = {
  id: string;
  name: string;
  location: string;
  status: 'Lost' | 'Found';
};

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'Lost' | 'Found'>('Lost');
  const [items, setItems] = useState<Item[]>([]);

  function addItem() {
    if (!name.trim() || !location.trim()) {
      Alert.alert('Missing information', 'Enter an item and a location.');
      return;
    }

    const newItem: Item = {
      id: Date.now().toString(),
      name: name.trim(),
      location: location.trim(),
      status,
    };

    setItems((previousItems) => [newItem, ...previousItems]);
    setName('');
    setLocation('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.form}>
            <Text style={styles.title}>Campus Lost & Found</Text>
            <Text style={styles.subtitle}>
              Help someone find what they’re missing.
            </Text>

            <Text style={styles.label}>Item name</Text>
            <TextInput
              style={styles.input}
              placeholder="Example: Blue water bottle"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
              maxLength={100}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Example: Library, second floor"
              placeholderTextColor="#64748b"
              value={location}
              onChangeText={setLocation}
              maxLength={200}
            />

            <Text style={styles.label}>What happened?</Text>
            <View style={styles.buttons}>
              <Button
                title={status === 'Lost' ? '✓ Lost' : 'Lost'}
                onPress={() => setStatus('Lost')}
              />
              <Button
                title={status === 'Found' ? '✓ Found' : 'Found'}
                onPress={() => setStatus('Found')}
              />
            </View>

            <Button title="Add item" onPress={addItem} />

            <Text style={styles.sectionTitle}>Recent posts</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.subtitle}>
            No posts yet. Add the first item above.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.badge}>{item.status}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  form: {
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 6,
  },
  badge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  location: {
    fontSize: 16,
    color: '#475569',
  },
});