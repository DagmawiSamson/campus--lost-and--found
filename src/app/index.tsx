import { useEffect, useState } from 'react';
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

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function itemsRequest(path: string, options: RequestInit = {}) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase settings. Check your .env file.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `${supabaseUrl.trim().replace(/\/$/, '')}/rest/v1/items${path}`,
      {
        ...options,
        signal: controller.signal,
        headers: {
          apikey: supabaseKey.trim(),
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error(
        'Supabase took too long to respond. Check your internet and Project URL.'
      );
    }

    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadItems() {
    setLoading(true);
    setError('');

    try {
      const savedItems: Item[] = await itemsRequest(
        '?select=id,name,location,status&order=created_at.desc&limit=100'
      );
      setItems(savedItems);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load posts.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  async function addItem() {
    if (saving) return;

    if (!name.trim() || !location.trim()) {
      Alert.alert('Missing information', 'Enter an item and a location.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const savedItems: Item[] = await itemsRequest('', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim(),
          status,
        }),
      });

      const savedItem = savedItems[0];

      setItems((previousItems) => [
        savedItem,
        ...previousItems.filter((item) => item.id !== savedItem.id),
      ]);

      setName('');
      setLocation('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save your post.'
      );
    } finally {
      setSaving(false);
    }
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

            <Text style={{ color: 'black' }}>
              Loading: {String(loading)} | Saving: {String(saving)}
            </Text>

            <Button
              title={saving ? 'Saving...' : 'Add item'}
              onPress={addItem}
              disabled={saving || loading}
            />

            
            

            <Button
              title={loading ? 'Loading...' : 'Refresh posts'}
              onPress={loadItems}
              disabled={loading || saving}
            />

            {error ? (
              <Text style={{ color: '#b91c1c' }}>{error}</Text>
            ) : null}

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