import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Get screen width and height for full-screen header images
const { width, height } = Dimensions.get('window');

const Home = () => {
  const headerImages = [
    'https://img.freepik.com/photos-gratuite/piece-maison-decoree-dessins-folkloriques-bresiliens_23-2150794161.jpg?ga=GA1.1.1166153080.1721639513&semt=ais_user',
    'https://img.freepik.com/photos-premium/interieur-elegant-canape-modulaire-design-neutre-cadres-affiches-maquettes-fauteuil-rotin-tables-basses-fleurs-sechees-dans-vase-decoration-accessoires-personnels-elegants-dans-decor-moderne_431307-4607.jpg?ga=GA1.1.1166153080.1721639513&semt=ais_user',
    'https://img.freepik.com/vecteurs-libre/illustration-vectorielle-https://img.freepik.com/photos-gratuite/design-interieur-cadres-photo-plantes_23-2149385437.jpg?ga=GA1.1.1166153080.1721639513&semt=ais_user-1121.jpg',
    'https://img.freepik.com/photos-premium/salon-canape-plante-cactus-plante-pot_31965-94545.jpg?ga=GA1.1.1166153080.1721639513&semt=ais_user',
    'https://img.freepik.com/vecteurs-libre/illustration-painter_1284-3https://img.freepik.com/photos-premium/mur-blanc-cadres-lettres-noires-qui-disent-mon-amour-est-maison_1142932-1501.jpg?ga=GA1.1.1166153080.1721639513&semt=ais_user060.jpg',
  ];

  const categoryImages = {
    Plumber: 'https://img.freepik.com/vecteurs-libre/concept-plombier-symboles-carriere-travail-illustration-vectorielle-isometrique_1284-81752.jpg',
    Electrician: 'https://img.freepik.com/vecteurs-libre/illustration-vectorielle-delectricien_1284-5141.jpg',
    Automotive: 'https://img.freepik.com/vecteurs-libre/illustration-vectorielle-automobile_1284-1121.jpg',
    Construction: 'https://img.freepik.com/vecteurs-libre/construction-illustration_1284-232.jpg',
    Painter: 'https://img.freepik.com/vecteurs-libre/illustration-painter_1284-3060.jpg',
  };

  const animatedOpacity = useSharedValue(0);
  const animatedPosition = useSharedValue(20);

  React.useEffect(() => {
    animatedOpacity.value = withTiming(1, { duration: 1000 });
    animatedPosition.value = withTiming(0, { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
    transform: [{ translateY: animatedPosition.value }],
  }));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.headerScrollView}
          >
            {headerImages.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.headerImage}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="ios-search" size={20} color="#000" />
          <TextInput placeholder="Search" style={styles.searchInput} />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {Object.keys(categoryImages).map((category) => (
            <View key={category} style={styles.category}>
              <Image
                source={{ uri: categoryImages[category] }}
                style={styles.categoryImage}
              />
              <Animated.Text style={[styles.categoryText, animatedStyle]}>{category}</Animated.Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.featuredContainer}>
          <Text style={styles.featuredTitle}>Featured</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.featured}>
          <View style={styles.featuredItem}>
            <Image
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoFSN4Gmp1g6RBenGExiSMPKlXX0pg7jnkCw&s' }}
              style={styles.featuredImage}
            />
            <Animated.Text style={[styles.featuredText, animatedStyle]}>Plumbing Repo...</Animated.Text>
            <Text style={styles.featuredSubText}>Water Heater Installation</Text>
          </View>
        </View>

        <View style={styles.allServicesContainer}>
          <Text style={styles.allServicesTitle}>All Services</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.allServices}>
          <View style={styles.serviceCard}>
            <Image
              source={{ uri: 'https://img.freepik.com/photos-gratuite/carreleur-travaillant-renovation-appartement_23-2149278553.jpg?ga=GA1.1.1166153080.1721639513&semt=ais_user' }}
              style={styles.serviceImage}
            />
            <Animated.Text style={[styles.serviceTitle, animatedStyle]}>Home Construction</Animated.Text>
            <Text style={styles.serviceProvider}>Barry</Text>
          </View>
          <View style={styles.serviceCard}>
            <Image
              source={{ uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQTEhUTExMWFhUXGB8aGBgYGBofGxoeGxoaHR8eIBgaHSggHR8lGxgXITEhJSkrLi4vGh8zODMtNygtLisBCgoKDg0OGxAQGi0lICYtLS0vLy0tLS0tLS8tMC0vLS0tLS0tLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKMBNgMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAFBgMEBwACAQj/xABAEAACAQIEAwYDBgUEAQMFAAABAhEAAwQSITEFQVEGEyJhcYEykaEUI0JSsfAHYsHR4RVygvEzFiTCQ1OSorL/xAAaAQADAQEBAQAAAAAAAAAAAAABAgMEAAUG/8QAMREAAgIBAwIFAgQGAwAAAAAAAAECEQMSITEEQRMiUWFxMoEUsdHwBSMzQqHBkeHx/9oADAMBAAIRAxEAPwAWhr1mqn3tfe9qtBstl6+d5VQ3eQr0UYCSK47ksl68l6rZjXu0hYaVxxIXq3wjANiLq2kIBPM7CvScGcqDlOomrvZvAucQmQOTrKrEwRvvsNN9KWc0lsCyjxLhVy1eaz8RUwCBofb6R1po7O9hr11Qb/3KHkRNw+2y++vlT5wzgyI3eMAX5H8vp59TRVmqduS8yByUsFhLeHti3aUKo+Z5STzPnXm/i4rzi7vhP75ihnELo3nlHypjgrYu5m0Ox/p/iroB3oB2VuS1weQI+s/0piagErXjVQvv+lTXzVS6xFE4p4S1khBspyj/AGkSo03gGPas2/iS3dYwkad5bR/pk/VK0jDNLv6g/QUl/wAV+FPeTCXbakkZ7bbeTLJPQB/nSTVofFLTKxG4fxUidd6mbGyKmvdhcRawzYpmt5VUNkUsWiQCT4QBAknU7UELgRv6VncXE1rJqQbS9mUrHIxQS/bvLDC2ZUiCDMjoeo3qdcWVB8J05TuPbl51onZXClc9x8PcUKsZbiHTMfMQ2k+x86i24bhySjov0AXAMNbu3Ql1SMykDlB219NflWtWsILLYdLa+FVyjyEf4pGx+Guf6zhmcHJd2kH8Kn+4p8u4hRJA8SEj9/SpwlUXJ7GDJkc3bK3FWzXGU7AD/upcThbK4RxdhLbgFzMbkAa/KvWPdTfszuVP9P70N/iPiLYweW42XO65RzJQ54+aiqYIVKb/AHvuTXLZmHGFvYO8ovki05JtzBlAdCYnWCvzo/wniGHuGO9EnXX970iY69evXSzJcYBcqhpOUDaJOg8qJ9muxd++CZydAefn6frXa9PsdpJMVjHTE3LmHuQR4R6e++ooXxriI722wX4Yn9/OmXH4JsG8W7BuhAPHyLDUjT9aC8T4X31+LK6XRnXyB3n0PKl/u3KqTUdgrjeHYVXW5cuK+cZyqc/kTETtM1J/rfc27iMpNq6IQtrl3210/uKs8G7Dsq+JhmPLl86Fdo+A91BBbJOs7KeelDHjcXQjkpMj7T3ku4CxcRY7vEvbM/z21f5eGk/E8Ia2qu3/ANQSvmKbLl9bvDsWqxFm/YcR/Nntk+hkVS7Pd7dxGHTK9y2DkgCQiuCDPIdf+IrZkbUYjwA3GLFkWbBtO7MVOdWnwNpMaACTO07Cha29KdsZ2BxSqvgLA3mQxvC6h9vhI+ulK+Iw4W4yflO9TT2LuLT3Bd0xpXmwJDD3FXsRZIlSCD5jWrPBOEG93mUwUSY/NrEetPrUVbJteoGFs11WspGnTSup7sWhpwV62TDmr+MsruutTWeytvdrhoxh8PZURE6Vr8NvkTxEhPvXWRgQJ9qM4C7cvJ8B+VFGe0Pwivf+ohdgAKPhXyL4voDbfCW8QI1qXh3DnRdetHLN/Nr1qXDWWuOttd2MenU+wk+1CWJMXxG9i1wHh17EPAbLbGjNG3kOrR8vlLrwvA27Kt3SBR1/E0cy25qfCYRbNnIggAadfU+ZOtRYO5KATuKgoJbjllLnhHpUWJvRHpNVcPe0E8tKqYm/L+URTBJMVckP/tn6igmJvyu/nRDiFyE/4x9f7Uu27k+9BsAZ7J3Ju3ZMDKuxjm2k/varHGmQSQqz1jX571S7Ip97dH8o/U167QWsoJmp2aMUUwMO1l7DtrN62N0J8YH8rnn5MSDtK7012MfbvWRftsGtkSD6bgjcEEEEHUGazS74ian7Ks9q9dRT91cSXXlnDKFYDqUzAnnC9BQjPemPlxJK0O2CctLbE6/2q3jcN3uFuJEkDMvqN/oSKi4Ukz6USwxynyn9dKqZSjwnDyi2zqCsEHaI109KReIfwtud8xw91Ps+/wB5mzoOggEPHKSDtPWtBw+JtW7wts4BglR1AME/Wiiv4hEZIM+/7PzrHmn50rG1OPAjcA7G4eyWd5vZNi4HhkgzAG+gjprTNjOKIFDpGXaKr4y4wcpmyrBkRvG2tVOyzPdd0bLFkggEamc0T02rzk55JKK7/wCiTnKXLJxfW86XSJZD4Z6+VWsMVyFiTmdjmB9eVB2xrW7zi6ACzeBRqF9/3vUXGeLwyrt3aGf9xiK7LJrG4MW6DXAr4vX7t4DwW1yJ1k6tHyHzob/EvFgYZCtsXLmrqYkJAALR/wAoql2VYrZ+Iq1wmlrj3FbiYi+tmAO7CEHzma04c23h1uMpA3scWu34uOSrHUDmfy1qGNxAwwynwtcHxCJUAcqRODYxLFtsQUhkMIAN2iNBzqW9dv4tVGMbIFaZSMxDHp5LNPKG2p8/kC+4bx+LTD2+9k3FiFWdCepNCLFi7fw3fi0UYOWAtiWZDy8tedNPAOCpasMmc3VZiULwTlO3KpsPcaLlq0Ft20Q+IfEW5+g/elZ8cNU3Ft/P6BM+btZduMEQG0Bp4tCDtNeOIYfF3bTK9xWgeEaAmfaj/E8LZKW7zoGRJLlRueum4FX4w6lriMpKWnc2zvCr0PqPpWmONxd6vsMtmjPeE8MuWsNjkuJHeYUXV8+5uo3Lyerv8PeNvhrlslfublwWy0a5m2HQwSpjemDh2MXHW8U1uzlC4a4rknRc6NAVeclR8qzzhb3LiJakiytwXWgiQYjnvpWrNvjQ8HvsfoVrhKFV+JfFr+grDMZ2XY3rqhhmDMBGxM9fp61r/ALrKiq5zObYMBs8rOkzGpEdY6mlHi3B7oxDOjAWlDXP5ioOukbhmHtXm65Rlu/sHXJlftx2c7zCJdVR3tu2pJjVlC6jzilLsSml08zlH6mtZ4Rf73C2y2pywfbSkdeBjC4q6iz3dwC5bPlrK+qnT5V053jkgTflYm9r8F3d3OBo+/rz+e9dTjxvhYuqoI2P9DXU2LqkoJMWORVuVDdM718L0n3O1Z/Cv0qFuO4h/hQ19C5xI6WOtxxQ/E4sDSaWCcY/Ij51LZ4NijOYGKnLMuwyxs0LhmMBtqRrTx2Hwc5rzDfwp6D4j84HsazXsPwS9evW8PJVNWuMCJCDf3JIXyzTW4Ye2tsZUEKgCqOgHr+tK8iktgqFPcs3WG1BcMcpKnkfodvpRJLsk+QoVjzEONtj/Q/vyqaHI7yamKiuAk7acz++dcMUGYkda9s8hqLAUcXdzWifOl7DPRsHwMKX7WjEedSn6HDF2ZaL/qp/UV67UKYMVU4Pdy3UP72NW+O4gEkTzqUO6NOEU7eFgV44M337jov9RRZrBbYfKosFhsjliNwAfb/um07lcjeloYeE44ITmBq9iMaNT8KjVifKhNhAdgKU+3PHfEcJbPwwbxHU7J6AQT6gdapKVIyQjqdHvDcS+043vNcrHu0HRTIX01Ob3p0PaL7Plw9xT3u0x4Y5GfOs24Oukj50+Oe/VLrrOgk+Y3HzmvM6huL1Ll7FOqhpSa+AzxzFWwq3GPhZZU/v2pdwHGltX0v3DlRwVOU79CR8/nXnjl1gptyGtBZQcx5Urpic+HKBQSjTrvWRSqbkvWzFq3NDv37DQUtgvdfS6+wO+h35bCKXeNW3ZTaCqbr3ZDDmAOvLUVItsNhLN9Zkt4lJ0UrOse31FDLXElxL3MOfu2mbbDr61SWVPzV7P9SjQT4ngWsW0Z7yKVgkA6g0o4vFNcZmWGe44AyjpH+aZ+0uFXD4HD2Lh+9vPnutufCOvQSo9qSm4r9mLNbMaaGNZq6xqM9vQVrcZuIYu+gUWsKzZI1KmJ6gUp8avYrP311HEjQZWgevKr3De2F5Ldy5du3WdhFlNAAfzGh3Du0+OnL3jOCdQyAqMx5mJHpNWkr5GS9DVOwGNxF7BKbyKp2Q/nUAQY+fyo7awfdZBKi34muSNTIMR7n6UI4Fi7jYe2XCh10hRA36elF8NxJGTLqd/i2P7NRWRKWxojBU75Mj4vffHycNdNvupXudpTaQBz5EHyph4LhbiWrTOufPayuHBhhsV6iQFOlNXDcIjZ1Zbah7kKAIYHr8yajQlD3FyIB8B6HpPQ/vyk8klWrh8EpKrKfYXhSWkvL3mtwFSsRA1IO+u5FZFgMMVLIynMhKxqDoSDp6V+gMDgBo6jUUmXOFtaxTpctZwyNkdNDkzA5SPzKIGu4kjy1zyyjj4tBW6BHGuMG2MDiUYqJUMQTECJmNToDpT1iG+1YV7topldD4vxag6ehO4qhjezGHxeFS1ZIUKwIbUzG6leUydfemazw2ylvu1VEUjKQOYHn9aSWNZd0+w0hE7F4ubbWz+EyPQ/5q3x1pCj8rFh7ggj0Oh9qCcL+4xjpIjMyb8pMf0o5xVa8tuS2ZK/KDUuTXVRe7lYr0r7TqF7okLRu4NQclkt86kwnFAP8Ax4b6U54ZcEg0tAnzH96ns8YtpIWyImeVejLrZdolfEEx8Ti3IyWSB5D+wq2ezfEGUsygD6/rTNf447fCqr5VFc7Q4hlykgDyGtTl1WbtQPEY1dgOz/2XD5n1vXNWboJ8KjyA19SfKjRffzNAuA9qUuKLTwlzZBPxgAnwzuwAJjoJ6wTr1MbuKLSi4umWE2aquITQg6iNa8Ym+1u2zKJOm/rS7f7S65bsJ57D3NPZMtsqpuYHI/09RXkY4agEH3qjxXiljL3VzxBxsAx9CCo0POaWX7OAnNhr91T0ykj5rH6UW/Q4bS0A0EvaXPWguF4tfsGLzLet/mVhmX/iYJH1onjbq3UDoQw5EVCd9wpBPCP4l9R+tUu1GJi4Uzc6FYPiPzFDuL2Lr3CyePMdAPi15Rz9qk7TL4ZKPIZwfEMmmb3FF7fEjGsMKz77QyEqwIYGCpBBBHIg7VZw3E2B0pfFNaSZoPDOJorzErzXn6ikbtdhUt4y41v/AMd3xj1J1HqD+tWrPExzGtEO9s3lyXYPQ8x78jT6lIXw0naAvBr0aVpXZfE2zhDbJGdnYKPYH+tJOF4N3J3zp+bmPX+9G+FcMY3bZRwni+I6+3ry96lmxOUXQma3jIsXfyXltt8asB4vh16npRrHdlrITvjFm5u2VpQn3/xVP+J+HCi0wPinKxjcbg+x/Wmh8Mr4cKTmDJBPtXnPHW0ueDzlFboyg8aa01+1EozAwDt1j1FeuB8M+24ljbLWwuVlMcxE6/086v2OyNw3c7QgQxLbOP7VNj+1lrA2mtYW2GOY+PlPlTw48i3OXuOHbvgK4m0CB94mitOgHPT2rG+I8MKv4yIHQ71tna3Et/pl64phggMjlOWfoTX5/dMxMsRzJmtijNvVfI0luS3byrLODP4RyrUv4OYJbuFu3XQa3SoPUKFI+RJrK8A+c5bi5l5dQK3L+HZS3wzOB4Abjeykz+lUjFN6WhouuCXBYco7oyx94cusgrpBH6e1BLGHunFOAQLAnMT1Oqx7a0f4k6m5aNs6suY/PQ+8n5V84TkW+U38Oc/8YAJ9NKwL+pTQXNtuxYxuMyMVBJB2ncf7W3UjcUQ4Zh2u2HZYYIdNfFBEmQekH+lKXGccUxLLfuZuXLQDYiOgqd2uWTnttow/CdHU6/2M1Nw7dibdcjt2e4zkOS4dI8J/oa7tBxldHt/EkkH1EEaeRpZtXsyq4IMiTHXz6HyqLGyNRseVNiyy06G+BXJrYIXMayi3dshouKcy6w5ElgQDoyg7jp0qReMWjDM90HKcozQoaQcv0pe4NjBbvrnJCyYjkWBWQPQmo+IALeBSWVmAEiJ8yDt1rmpRl5eH2KeJasBWcS9287libhfSNtD/AIp+tYgXbQYnVfiA1g0GxuCBW6bNseEyWRp2jMCIkb0M7PY/u8RkY+C7ofXkaXPLU17IVKnv3C/Eu6DAnNqK6rr8HF0FGcKUP0rqOP6QP4PK8Kc65T8ulWMLwW4wnKY86sHi2IUyEAB6g0SscZvOAAm/lXW+5yop2uzFzLJAGu1WsP2Ucklio+tX7WNu7MDv0okMYQKKaGpGN9o+H3rVy2rKQ1q7M9RquYRrs2YGiPBP4gXLTtaxSswDQHVfGBoRnT8Wh3Gu2h3p/wC03jQFRJPh2rMOMYNcOSwGXmSRIJ//ACBJ9Ir3ukjGWNVv/o7NlcpamaXb4v36RbZSCNeTDzKmGG3OqJwOYQ5BH82v0A/rWTYnG3LkBQMoPxMAI9IHh+uw0qx3t0IcmJvwDyd4UEaDwtuTsNtQJG1U8F3sJ4lmjpwO2JFuVHJUuXFA9lOnyrwMdhMOSpu57gGyku4nbXWD0mDSPwezcYu1247ZRMXHZlB2UQSQYOpj05UR4XgghEDM7a6wcs7s3855LyFaYdL6sm8voT9oLj3lPc4e4+YQO8vlV6fAGOb6etKvBeH8Sw9wgYY3UcSUtkELvtruImNZnfWtF75LUu4zNoAgOp8vIVNgMKCxZtzJYcgDy+WldPp4UwxysyrFcTZLhm06E6gXFKn2B1NMvZrtZ3LKwRQfxO2reiz8INPdoIyKlyHZphIBhSZGhGgAoRxDs5bxFwzmHdgBXB1EgGIaZAny3qKxJMfW2X+ILg+JKDcHdXiPDdUa+WYbMPLfoRSDx7sxiMJ4nXNa5XU1T35qfJvaatY7s5jMMxdD369U+L3Q7+xNNfYbizXFLODAYoAw6DxaH1Aj1pcvSY5LVHYpjzyg6M3t4sDerVm6D8LVonaPszgbxXKgsu0km1AETzX4Z35Us8S/h1cDsuFvi9lAYhhlIB2EgkE6eVeXNeG6ZuWZNWyng+LPbPl9PlTJw3jNtv5f0rOrb3VzaNCGHMGFJMAE8iTO9T2uIEeXpVIyaH1KRq2It28VaazdY+I+Fp1H96JYbh72s1oXBCWwZbSeXttWZ8M7RgQtzQdTtTx3oxWHIe8FtyFzjVjGuRep21O3nUcnT6uN/Yy5MSW6PHEbTYiywFx1ZQTlWPEOY1oV2D7K4XErbuXLguFGabDRsAV8anX4iD7CjT4G7YGdZZV2Y7lf5hyI289/KrnB+DqcTbxVm3aUsCbra5mlSIWNAZInrWXp08ebTJElHbcn7YMq8Pxi8lEAeuUCsF4hgrttLbMjBb0lDp4oIGnPmK2X+ImLbJcw6QGv3LVsHpmZdf0pI/iXj7WHxqWLdoMMPYVUDEkLMn3Pw61ti3tXq1+YAZhuwfESD/7fu10lrly2JkxyYn6Vr/Yrh74Xhy2rjIzJnkqZXxOx3gToaz/7TiBZw9640JeSSFkBSdxqNwIPvWg9hVKYbIwaA7BSxnMpMhp6GaXHni5uPA9JFC0oXFZQfD4QvkMgMe00bwOFRWuuPEPhiPc6+ZP0oBeQ/bgD4Q11iv8AtRYmP+JptwsG22XbMdfeN6ztXMEap/JhXbXhjJiWKDwHUfLUUydlMNcbDxcU92dbRO/mPSdqtcXDfaWs3iBczAqwHhYb6L8xTLcthbaqBsKTJNxjXoTyKkKF6w1hpGtsnUflPWpXYEeR2oqUvNdymzmstINwfhIAMMN9Rz8/lFb4SqSJMToOnlUM6UYqfBNppCtj7OafzD6iiHZe79pxC27pBAQjYTopIJIGu0SfKrnHMCiWxcDazQ7srwh7183bbZFRjmPTy85E1TBJzaS7hg6DA4ecKzX7LZ7ZlblvUZlO9JPG7OU5k0E5kgzAnTXy29q0LH3LVklVbvC3hKkmB5wN6Te1GB7onQZTqI21qc4OE9LW5ztoLNiDds2r6bsIb1H/AFXUI7EcVCC5ZbYHMs+eldSNOLoak9zS7dtwDmExyO1fbguA+AARyHKgZ4g3w5iYHsa9JxRzBDQNfmKtpYRhtYltMylpqzZxKl9UPkKVf9SuMVOcj4um9SLxi5Ay6yYGm3L5k0HqQNQ5XLYdSIiRWU9rbQzlWEMDHnMTpPkQS2wBHUUwca7b/ZQA33mIbRcOn5o3dtcg20+Lypawi3cTYvcRx97KW0sIirlAU6HqVJmNdd5MiPV6TJLHF6trGeJ5OAZ9mths9wEg/gB0H0mDvA29NrS8WWCiKuXkADptPONdjO9DrHFbV7ZgWH72/frXtiDtAP1+tb1ldGR2nufcUgICyUtzJAMyYiY5x0mKqLhLg1UlRHLT3LbD0mrNpCupGYn8WugqdX88x5flHt/3TqU3vYLKK94gB7xlX+Xn89T+lXF4niVUkuyg6DMfqxI08gBrymprbCSYzt+Y6KPRaju4YlhcuMDl1VYHyH+Iq8DrD3Bcb3NsMdXfVZ+N/wCduaoN4O9MHCrwCyWzFjJJ3J60o8GstfuhY8TksxPQahcwg5fKDVyxxGFZm0JMLzAjQDMNj6gU1RcnHv8Ar/4MrSsbyZqNbIY6jynn86B4biRUDNzE/wBN+ftR/BtptrGvlIn5xFLNaUPB2xa7R4e5Ybvw+dCQuU/Euh2jQjQ9N6s9ne0yKwY7xB8x0qt2px6vcFoH/wAZM9Mxj9Nvc0tXrY32PUf1GxrzMqTkz0se8KkanxHD28TZvdyFJxAVGMDbmD7E61jPHuA3MHfNm8NDqjfmX16jY/5rQf4ccQZcR3bGVdTB5Zhr7aA03drezFvG2mV4Dx92/wCQ7g+nUcxUbaQn9OVGI4ThocjxyOYjUjyO0+tMeBx7C6ls5baoIRCQoVestoWPNtee5oC2HuYa81m6IdDBjYjkynmpGoNFcVhkxVooYDgeFuY9+h5iqQaRWcNStGv8JxKtaVsyuCPiX4Ty06jlNSJw5VM2jk1nKPhnyHL208qwPBX8VYv5RbuEIRItFjIAGUSokDbzO1akeL3Q9kMSpZJK+f7mjkUGvMZFKroj4tgb16+neIDFwE5YIhTuNelF+0fB8PiittkBOcMTGsKROsdJ08qrpAaZIMzNWeMYrIFZ9C4I8Mg5dOfU14fiqcXXZ2DHMp3uIYS8GwbDKnwow5QYkGNPFP7NUOCYt8NcODvn4GDI35kncfvkanwfZ6zdTPnKhNU2zCOvIjlHPyr5xhWx2HY5RbxmG8Rt/iEjYH8Vu4Boeo6g1WeOkpJ/v3KScXuj0zFuJWgNYS+SRz1Qfo1G+D4okMpUspdjOgVRJOvPWkTs3xqW71R4xacARsTk0PutPHA7KZFIhwAqts3igaj99aOODlNO6BFbC12q4Ay31xYuLIYQrCRlGuvQAVfbHqyDP4MwBG8EHodo/Sj72LZL2i2ZTqysBOvITqdI8qA4vIy27Ni3MAkKVY5VgnWfickRl5TVFhk1TOcE1Qf4WNCMoU9BqNhqWAjWgXanitlXVWuW1uGB3eYZ4I0JXeNPrSxext//ANw9y27W0YLbXMyqAqjQqsA/Lmd6DdlbNq3dvXbipduFRAOabZJkNLDeQNZq3UwxLE1IEo3HfgK9obT3ymHSBmMyTAqyllsHYuKreJngMvMwP0qpxDEh4MC2BEQecx00n+lEeHKrEZ9SNRPWvOhmWGHlW67mfgXb3Db9tXuZWcbggwffn5yNdKuWcJfxOFy3lKkA5WbVm9Sf2aZsdjsiHpQO5xhnKoOR0qa6rWt1uHXWxn+Fwdws0aFfCfWuo/20W5bde6UgNqxA/FzFdWyKnJWjmmjTX4KwthQFZ436kkz6cvlXYXs48pmKwAS3m2sDbYaa67bVf+2EECJJolh8QD5QJJJEAdf1ro+ZpWVAXFOBKqlpRFXxEtoqgaknXoPoPbPe0/ay1ZDCySq6wdrjf7f/ALSfzfEfLY/e2fabEcUxH2PhqM9q2ZZ9lJ/O7HQIPwg777xFXA4PhvDT3uKujG4wawuqW28p8II/MxLaaAV6EOnUXb/fwPFJb0UOzHZDGY1xcuoLOGcCSwhmSZyou4B0k6AjmdQXjtXx3CYVFt5Vu3VEW7QgxG0jZfXfpSljO2GN4gSlo9xY55D9Dc3J9IFBb9pbRhNW5sdSa6eWKlSW5ohCTVgfiqXWc3rvxu2Y8o6Aeg0qazxpgZbJpy9PSvPECX1YkxtUWA4TbcHP3ubUwgUyAJOpGkDyNXg9rZKcU3QaTtQglWUoeek/Pn9K+jiKNBtkEyJgjrrI5e+taJd7F2MRhrSYlCbiIAl8Mc5QfCGYgEmNwQYnShXZ3sLZAa1fsDNLAMDrl8MBjzJk7aDT1ofi4Ri3fBmeCIsHFMpIbSDBBHTlXr7bBmRRDjuFvfbWBshVZwMswrCQJnqRzFNHF8NYw5SzhsJYe+zKIuK7rDafETpG58qMP4nDSnp39jd1P8HeKMZRmnat+xf7FYawMOL4Oe4ylGI/BJ+GOu2tDO0XCbODHeXL5lj91YQ+KPNzMATMx5TRdeG3cPhrtmxkN3VxbX4UZhpGdpy5hOppBv8AZNspOJusL7FpaQbeYDRS8T1BInfTbXz+j6yS6nJkyTai2kk123foTj0ss0VHGk2ty7w098HbVMwyplO5666ZRrOmp05Gq2D4jisB91m7y00hSfwmOW5EaeHUHkQZoVheNd2CCchURB00GmnWg/FO0BvONYVRCg6ep9/6V7WXPqWxlx46dMYhckTOsySec/3qe3ihMHalW1jiedW0xkxBrGkb9aGeziChD23ysNQQdZpttdprmKwty2wfNEXDbicpMZgNxznofUVlF/HnlTx/B++zYo+QM+asp/8AkqUHyhZpNFhOAXcZh2+6Zb1kxZYgDOn5Wkzr15E+Zpc4fijbuQ6kMrQ6HQ6HUEHY1vXcBZyaeXL/ABST/ELhlgFcS1rNeGhAMd6NgI/EQSOmm8gRRlCuBceWtmD+L9vWs2l7jDrbttotxoykxr018tTpSfb7V3r19WYgqDLMV0PkNdOf+aODEpo2JXvrrjw2VXOFX8qptAG5oL2t4bbvW1axaNh08LWoCK465RADCfcegk+HHuSlv2DHCO1ZvYsYcLIOgYdYJI9tNfWtAw/AGObvSrqRCjXwjcD2JMRGlZj2U7I4i2BcYKq7kpcVnUdCEmJO5nQCpsJxTHWMclg3rr2nuAKxGbwMYMmPwgn5TWWWPDGTx1V7nRhStD4OzxKsrXSqxBjcwQQQT6c6GYriFwFGtsC1kkI7DVlOjI5EZlOhjqqncUb41nRAc+adNBHvG1AMJZBnMYEHWJ/SsGabxyjjxc9yM5yT0oXeC4lF4hfBhEuKzaGFUk52nyALfStATAC0We3cWddS3hKrrsPiII39ay7HYDJjklhluCTBB5FGUxz5R51p3CuFHChVtxkGoD65QzAsFjYEDnsSa2YYt/4LxbjHdny+xxNhbvw34hgh5K3LmRIBmiHDca2QZmzEDmB/Sq6ZbhF5JttbOUjQqVmSIOqgxyj3obxnHIM/dzmEllAPhgxqOQmuzucJKUXt3OnJpWuCw2OKFwAGzOWzAyASdo200rv9NW7dv3bgBF61bQKF27suZzToZf8A/WkXBcZdGYESCZG9HOB9og9+G+BV+Z/c1ix5cniNN+Vk1lT2Jb2CWxdWQHUyCCARqI1B9aqYPDE22BIDBiEI5idJq92hvpcuDui0AGdNCfLWapYDiVtEhviFQyasb01YjST0lDtEt+wi98VObmP80BtYvT150S7W3Tiu7BvIiTz3NDsTw5bWRVurcGUmRyrRLFBRtCadghwtLt9QRmO5JJ5zHPy/SuqtwrHOtuA2nlXUk8sU6pneI1sbDKhlGUGecGdNjt66npST2z42l4Ph1uixhUMYq+NS7b9xbH426xoOem7tcSTOsrEEAEnrGnP9xWIdtuCYlMS2dB3ALMgX4cpfkpiDmYTMEk7mZrfgkot39jQkiDjHa8vb+w8Ms9zhzo0Hx3DzNxxvPMT69KU7NoC5kuNIDQx9N4+UUWwvF1tqQITbZdTqAwnWCASZ1GntQ3hCWlvob4Z7ZYTuuhIltAxP4tPrNXUpTux3KKqhtvvlwqXrbWxaZigRWGcFfzJuNIPoR1FBL10hQ5UhWkK0aEjfWmbj/C8PiFVMFcQm3mJUMBIaCTJEGG0MaARoNqFYmypwuRJ8DDMY1gjxGGAI0QEH2qUoKEq7rkpLOLz4gUe7OYdzfsRlhiGJOYgKNSCADusjpOk164T2YtPbus5uKR8MFek6KVGaNZ26aGnfspwE4e0rTnuwQjDpmzAmRpsOWnnWzp54Z6ozfbb52MmbJNJOP3+BmwWOV1RWiASF5xBMT0MaVPib6qqmSzAxppAMTv7V8R84yvq4kidyOfpzFCbFzOrMJIkLA1+EmdRz1514PXQh4mnG6XzaK4W3i1S7f7J24Z9odWZD1k9NPD6SAaLcd4hbwGHLW7ctsABzPNjyH66UIxfG2syFDNrAjp0+tBMbhe9DsGuDNqwdSSD5Hap9LlWPG/U0rPF5lDK/Ku3YbMIytlxCDNmA1/EAeR5nUjy0oaMAXxCFz4VhmEAy0kzH60A4PaOHYOpLMNDnWJk6mdQfnpTPhONJcDo1oK7aKQCATyBJ/wCqVNa1TolDqdCkod/yCnE8NbvoV7tLjAeEuoJU/m1U/oazNv4bveP3NxQo0uNeUqM2k5IHiWTEmBtBM6P9ziTR3Suttl3yxHLrv/mhg4jeuki4oHdsChDqVYjSREDafDqYPKvUxdXGMWnyvaiEZCL2r7DWrGEOIw7Pns5VxCSWQN+IglFYRmTkBl101lB74j16Vt3HbivbbM6orSCMgylYJMiIJHxarHXzynivCc7j7OxvK5DKxXIQrjXMp2GcAiNDn03rViz+ImwqQKXF9RT9/CzFlLl24CVkZQREHrqfb3IoDb7H5NbzTovhDAb7gkkefTQc6Z+HX3AVcoS2iSEECApIByjc+BiPczSZJ7bHPJsa9heJKwkNI6+vpVtb6nmKy3AYti5BHhXXWN94k6jnp/mL95mOkgtIIInTTl4SQNuR21jk2PqE9mBSTK2N7QtwviN9Ww2e3iCtxLqHVUIgjbQB8xy6bzzpd7Y9pRjbY7gEFbhJBGp0jSOWu9Wu1PDXvC2xY/dFwwGZ2fbKNQoGsiTAEzypU4f39jM1u3AU+EtlOaRsHOkzqY0ihkxxm1NcrjfYZ+wb4JxF7WCxIY+MEEMJ2AEQdDvNFuz/AG0W4AbjKrgjxay09QBAPnz59aV17TPiF7i5ZLi4I+6HjB9NRA67QKJ4Ts9YRrVxWF3uyCyqsZwupJEkMD1gTpUqc1JZo/H/AExsSlbNDv8AHFuZLReboSSSABqND4Sfi3Ht1obZLgs5W4YzAEhVt6CIaZJ1/ljTevPCeCWL11LolkHjJYtmuOebMTJAB+HrRHGcPVbjMCYPIkmKxSlGMHlq/nkSU1B7KxJuYfEZ+8UwwMgggD1A0ielH7fGLk+NokQQDpIopasW9ZEyI358z85oVxfhYVGcN8OpmpPq5Yfp7mfJ5t0RXOJXURrot5rYMGdj6jp/evPA+JW3w+Id9HJAIB0IHwiOgiqls2nshBiXtO5AKt8DCdgOpqXCcHw+VtSqKdXdgAx/lHStWmWRalu2uBlF6bF7F8RzmNFqTABSPjGp1A3NVsfgD3xVFLLvI2+dLtx3RoggzUoYUlTOg13Rr/AuFhh92IVfKlrtHhsrNJGhpw7JY2MCrRqVrKu0/EHF0i4d2JjprpVJY9TUY/cZpN7Mn+wC+VZWJKnxA0WxqKrQR4YEilzC4/ugt5SNTEA+W5powCW8VaN6ddoqmXBKlQJrYhv4gEAWxCxoK6grYw22KkbV1ZZQyXsiOlm+riDmgbbEdNAR9J59KpcQwqXlNu6oOYDRhp4WBmJ9PkPeW7bB1lk0LFRHOQPLTWar37QNxXmIkDWQRqROsyQJqlSezNlCyP4c2Xa4j2wLCmbQDHMxOrMx+KZAWJiPmV/inYa47ZApa6zZnIVci+K5seUgqQOkzyrR0zOymWyeQ9p25z+ulERZbXlqNP5dJGhkmJiqrUuGCkY/xnhXdY2IyKpJRoJJglc0A6s0RLSCeRmiWO4TnV5Qobh7sjKZkKPFHn4Dp+Y860hrEAAqpbQKCCwEDqdoHP8AvVDjvDVxCALdZGA0MnI0gxnUHbTf9apjjrdN7gcUu4lYmwFy27xChlCKpOrGRJYbDkBPpzir9zF9zEGSIUBdTtzzRAmaTuK4XGWLptvhy1w7ZMxGpJlSNT03HSiqYLEtZc4i0LSZYVr9xbQXYmSdcuh0idqr+Fb2SHkoJfUWMRx1lcNmJ8ayTtlg5gNpgHUiinZx3NjE3LaFmLwgBjNlUaAnQSZpDfh+FUgvji7EZcuHtlxGkAXHhTrGv9NK2vh9tbNq3ZAkW1A1idBrPmTvUuq6PTvLazoZ4aXGPqhV4dxsLfNk2CWde8BYGBEAieZn/urX/q20pZWtHQ7CJP8ASvvHeLWbN17zwAlvKx6EmQPXUfOlHB8SR1a7mDjU6SBP5RmANefbxpqPHAueWqepLkIcUxpvZgt0vbOqxIjyK8iKDW+064dhhr7uAzSGVYNsE+Hx5uo100jY0Nt9pMTGY5O7B8KFRpJ0WQM2wO5rx2swIxItXLUanI2mo8o001Jnyq+HHeSpLn/Ajg17os9ruN3MNf7u4CxIzi7lU50OiiCwXwxGvMUv4rtK1+6t1sRdBU+HPbXwjQFfumBymJIAAMDQa18xmBvXLNtbhYiyCFMlmY3GACLOw0gdIY9BVPF8Ea02UTqzBAYkgFgu2ktlPpp1r08UIJU6vuddB+3x1brQ9y24GoQW7hd2kHKma2FUuQqnXmTBMUQ7O4t72ZI+8YFhyBadvI/hXptpS1gezrtcMyLf4Gic0iR06gHzpv4Nw1yuYP4tzBILR0A1ad9tdPaeaUI+VAcrLV+07KS1tlEESy6eEHU6aag79D5VYVtlOZtASANp8R0mR7Dl5UUGHRlV3+NiAxnQlRvAOsg7a6k8qkxSKrjIukSdixkSPr05/XM/YWgUFcEZU8WbTfK2uhkCOYkjr13uphbiL8SnNAESOrNr0kjnyMVcwKkr3htsNSSgElyIAmNtdtdlrr6v4gwAldiNACImOn0mg1SsNKgbYwclXzFrcHSAJYzGhEQAZnSTPpVziGCDjM2mmUaL4dpOuoMfL1FW7FmSoUfCoMkHLBAkdCd9OQiquGxRLgKpgb9JidRyMt58qMZ6BlJRBljgFuCzKWgyGEBkjWVYDcGOcbSKAcT7P4vDfeWhcuICNl1AHMgEyI58ulaDgsIC6yFB+IATvoB4idTHL+9MFkRppMcttPL3rZik5q2XUrW4q8A7TrdtAOO7uDQgiNfep8df86n4p2bw+JMgZLqGCyAA6+cHfQ0Cw3CktDM+KuFRIysFB8Jjcb+tYus6eUo+V7EMmO94npb+a4iAxLamvHa7FoPuFaQYzE7RUN3G2Fde7eSeX9aE8RsXGDOV0J0mscMXlVq2iPCIE4fduX5t5XUEEZvhEdII6f8AVN9niZ7w23tK+myjb1nYVnC4h0bwsVHOKcOymKQKbiklm3J30q8+ojjXH/A7ydgp/wCnL+cuCqIxk6THlQfEcNVr7pcUbaN1p2ucaU2TO4FJmPx6kFydhSznhpKPcSVF7EY8W7XcAxApT4qcOAWugueVGOD8MN1O9uE+L4RzqLtNwxbVsIFlnowjkhPV2OV2KfCuBpiJhjHIAbV7wuJ+zE2Rn1O0c6Kfw/R7F4ow0b6U19pezgcd8vxDX1qs+prI4y4K2J64RnYhLbOdyeldTNwMPasAsIdm101rqT8S47UC16GnG6FKjeSROp356eka6bV5xF8IMxWNzOmw1n6Gvt6yTGuqjRiBO++37jyrzcQgsx5wCddp6Tp6+dc5uNlj7bAWeWvQ+f7+deGMXDJgERPzPqIk84qS0WDkyMsTtsdNPPryqVAImfc+lJdoBXVy/hUlII1MHMs+vPz1A9aslVhgInn/AGP1r46ADQRrp6kb1E0hNYJmS3l/eqeK4SsD3EDtvxzEWLSLYuOqrKuQBI1hfERImsr4jirl6cxZ2IMliWPzPrW7cY4GL3gnwkE5TqBPMTsRSHhOyWrIGAGaXYqREec6ACdNZnlW7F/FpKFVv+Zj/DLVbB3YHsyL2VxdQ3LevdnQhl1BIbWARvEGmDDdqFw+EvW++DX7Vxragk7yNTPKSfWNqixl66t7Dtbss2GtXe7aB4iHQqzGNQYYlemgG9Fu0PZ9bpYXcO+YLpixlJud2Fk3FUiGjUNrImdqR9R+I+p+hsxwglwZf2jxbXfCzGQc2Y6gtABzdNOfnVLhDuqOzAMqId22zGJidZJA5kfWvHE2RWM5jPiUgaZSfPWNKgtWWaAV8BGZX3GhgjyO+lMscdFF804ym5IlxHEdAqk6hZ6EgGTptzqG1xC4uaGPiMmTEEHQg8jX0cPu94wUEALoY0JA29d6pHAvEEGSTr6Hr051aCgtiMsljL2d406sfEGiCQRI3030OtNOCtJcClrjAzoVIWOcag6zGg+dKHCuHBSQwlgQrETtGhEddR7U5YFBbRWZdBJAK/l1BIOxMVmzyi5e5KTtl5MGougu2yiNRuNYnKWbfX1NWbmPVDpAJ6zJkGSSdhE9KDYvEXGBygBi0DM0AjpO2pnePWphhSpAe0RccRGjDLzGrc9dQOfOsjcmtgB/D3++HdgKABMRzjQg9Z00nQVUwd3N4py5QJ1kDYDYjfSNPSq+Hw+VmCwrMIJnUANOUcv+6mt2mDd3tAiee28c9if2aOvazrLdzHEkjRgNSM2mhPMQR4p09Kgt4guVDsAbnhyHc8xtqJ6+U15w9oMrCMs5QWKgcxrOx+HpyojgsEhC3lkZZLLcXx84MbgeR8qP1MZx7lC7imNxbYJjIDp1Mjc6bgRyqzcuFQFXUbHrM6ydOY5edeyjFySuVtNomP0AiBXq7hEYyHaJhQASJ5nNJn1gUtNoWi5gyQjOSdBlQdPMzzj9Kt/asoAJA6RJPux5+1VcdiApRTI08WmpbWNT+xQnjV5A4t5wFWM0cuZk0+tx4HbpUG7XFAhuNm339hvoPb3qW1hLd6ymZfCVzQd5O+u4pTwlkQYAySSGmZB5n+1HeC4t2T/kQD/Koij47pp70CMmBOJ9nVtHPbbNHL+1BOIccDqFylSNINO9+0bgIHz6Uu4rs/bDBnaRzECT61lwdRVvgTZrcS8mdsswDuaaOxmPsW0YOSQDCz0od2j4fmZTaWOUCqZ4NiLSgsBlPSteKcZR1epyqthm45j1IPdnQ0Nwa5lMiRQPFE23Hi3G1fcNxNkcQZB5VHwIuQukZ7PGHtj7u2Wyj2pZ4jxO9cu53Yhp26eVaRwp0Fmco1E0hWrYfEON9arCemNcjxo98PxjG5mjUVpnAMUL1qY+dZvinNhxCyTTB2Y7Rw/dsMs7VDqv5iU4rZHL1DGNtsLhEDLyrqtcZss0Fa6kh1EVE5sbLbb/AL5mvCuZXXcwflXV1FcL5LEd4x3schp8qrY0+MDl3e3L8PKurqRLaf77gLFi+xIBOmQGPlU7IMwHIgz7R/c11dRe739hkDuJGMsEjX+v+BVDHIPszfzXBPntXV1DD9bOCHDbKpoogEQR6TGn9auMssyHVWtajkZkbeldXVpx/wBWPz+oqMW7Y8PtgOwQA90RpOyiBptpFA+D2VGHtmNSH/8A6H9z866uq3TP+Uwdhh4SgDrA+LPm84Aip8NgLZsqxQFlGh5jQn9RXV1BvzEj7wtAMTcAEAgT8iaIuMxg6gH/AONdXVkm/N+/YDJsgVVgRr/ei/DUFzDh3ALI5yHmN+ldXVXH9T+CkO4NxKDuri8sinXrPWvFlPCp1lWEGTpArq6unyL3DGJfKpYQCBOw315bVHhdJcfEdz1k9Nq+11NP6hyHEYxwthQdLjw8gHMNdyRNWuFav5KCAOQA6AV8rqL7A7hDAWVuZc4mJjU/0r12l4datWw9u2oZmEtEnUjmZNfK6tNLw2xuwvY8/dHzmak4eYKgbf4r7XV5uT6l9gQ5DCiE0oFxgaTXV1JkS0MnMs4OwvdFsomN6VRiWIcFiRJ0rq6qvaC+BX2F7ErLEneaqOokV1dWhFB8wbn7ONfw0gJfZcQxBI1r5XVPD/d8CxNP7P2VdczAExuaW+KWguIBUR4q6urNh+l/cDNIwettZ6V1dXVhRQ//2Q==' }}
              style={styles.serviceImage}
            />
            <Animated.Text style={[styles.serviceTitle, animatedStyle]}>Gardening</Animated.Text>
            <Text style={styles.serviceProvider}>Janda</Text>
          </View>
          <View style={styles.serviceCard}>
  <Image
    source={{ uri: 'https://img.freepik.com/photos-gratuite/travailleur-entretien-service-reparant_23-2149176719.jpg?ga=GA1.1.1166153080.1721639513&semt=sph' }}
    style={styles.serviceImage}
  />
  <Animated.Text style={[styles.serviceTitle, animatedStyle]}>Plumbing</Animated.Text>
  <Text style={styles.serviceProvider}>John</Text>
</View>

<View style={styles.serviceCard}>
  <Image
    source={{ uri: 'https://img.freepik.com/photos-gratuite/homme-technicien-electricien-travaillant-dans-tableau-fusibles-installation-connexion-equipements-electriques_169016-5078.jpg?ga=GA1.1.1166153080.1721639513&semt=sph' }}
    style={styles.serviceImage}
  />
  <Animated.Text style={[styles.serviceTitle, animatedStyle]}>Electrical</Animated.Text>
  <Text style={styles.serviceProvider}>Mike</Text>
</View>

<View style={styles.serviceCard}>
  <Image
    source={{ uri: 'https://img.freepik.com/photos-gratuite/menuisier-femme-emballe-travail_1098-14196.jpg?ga=GA1.1.1166153080.1721639513&semt=sph' }}
    style={styles.serviceImage}
  />
  <Animated.Text style={[styles.serviceTitle, animatedStyle]}>Carpentry</Animated.Text>
  <Text style={styles.serviceProvider}>Emily</Text>
</View>

<View style={styles.serviceCard}>
  <Image
    source={{ uri: 'data:image/jpeg;base64,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' }}
    style={styles.serviceImage}
  />
  <Animated.Text style={[styles.serviceTitle, animatedStyle]}>Painting</Animated.Text>
  <Text style={styles.serviceProvider}>David</Text>
</View>
        </ScrollView>

        <View style={styles.postJobContainer}>
          <Text style={styles.postJobText}>
            Didn't find your service? Don't worry, you can post your requirements
          </Text>
          <TouchableOpacity style={styles.postJobButton}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.postJobButtonText}>Post New Job Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="list" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="list" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubbles" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    height: height * 0.3,
    marginVertical: 20,
  },
  headerScrollView: {
    flex: 1,
  },
  headerImage: {
    width: width,
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#007BFF',
  },
  categories: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  category: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
  },
  featuredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  featured: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuredItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featuredImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  featuredText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuredSubText: {
    color: '#777',
  },
  allServicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  allServicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  allServices: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  serviceCard: {
    width: 150,
    marginRight: 20,
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceProvider: {
    color: '#777',
  },
  postJobContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  postJobText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  postJobButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
});

export default Home;
