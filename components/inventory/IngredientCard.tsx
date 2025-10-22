import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IngredientCardProps = {
    name: string;
    quantity: string | number;
    icon?: string;
    onEdit?: () => void;
};

const IngredientCard = ({ name, quantity, icon, onEdit }: IngredientCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onEdit}>
            <View style={styles.content}>
                <Text style={styles.icon}>{icon}</Text>
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.quantity}>{quantity}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={onEdit}>
                <Feather name="edit-2" size={20} color="#666" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F5F1E8',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 40,
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    quantity: {
        fontSize: 14,
        color: '#666',
    },
});

export default IngredientCard;