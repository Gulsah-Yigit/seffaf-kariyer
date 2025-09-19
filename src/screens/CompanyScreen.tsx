
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getExperiences } from '../store/storage';
import { Experience } from '../models';

export default function CompanyScreen() {
  const route = useRoute<any>();
  const company = route.params.company as string;
  const [items, setItems] = React.useState<Experience[]>([]);

  React.useEffect(() => {
    (async () => {
      const list = await getExperiences();
      setItems(list.filter(x => x.company.trim() === company.trim()));
    })();
  }, [company]);

  return (
    <FlatList
      style={{ backgroundColor:'#f6f6f6' }}
      contentContainerStyle={{ padding: 16 }}
      data={items}
      keyExtractor={(i)=> i.id}
      renderItem={({ item }) => <ExperienceCard item={item} />}
      ListEmptyComponent={<Text style={{ padding: 16 }}>Henüz deneyim yok.</Text>}
    />
  );
}

function ExperienceCard({ item }:{ item: Experience }) {
  const statusMap:any = {
    'NoReply': { text: 'Yanıt Yok', color: '#dc2626' },
    'Replied': { text: 'Yanıt Geldi', color: '#f59e0b' },
    'Interview': { text: 'Görüşme', color: '#3b82f6' },
    'Offer': { text: 'Teklif', color: '#16a34a' }
  };
  const st = statusMap[item.status];
  const date = new Date(item.createdAt).toLocaleDateString();
  return (
    <View style={styles.card}>
      <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
        <Text style={{ fontWeight:'700' }}>{item.role || 'Pozisyon'}</Text>
        <Text style={[styles.badge, { backgroundColor: st.color }]}>{st.text}</Text>
      </View>
      {!!item.source && <Text style={styles.meta}>Kaynak: {item.source}</Text>}
      {!!item.postUrl && <Text style={styles.meta} numberOfLines={1}>İlan: {item.postUrl}</Text>}
      {!!item.comment && <Text style={{ marginTop: 8 }}>{item.comment}</Text>}
      <Text style={{ marginTop: 8, color:'#666' }}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor:'#fff', padding: 12, borderRadius: 12, marginBottom: 10, borderWidth:1, borderColor:'#eee' },
  badge: { color:'#fff', borderRadius: 999, overflow:'hidden', paddingHorizontal: 10, paddingVertical: 4 },
  meta: { color:'#555', marginTop: 4 }
});
