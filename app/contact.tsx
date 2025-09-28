import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ContactMethod from "../components/screens/ContactMethod";
import { COLORS } from "../constants/colors";

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    subject: "",
    message: "",
  });

  const contactMethods = [
    {
      id: 1,
      title: "Emergency Hotline",
      value: "1-800-ROAD-HELP",
      icon: "local-police",
      color: COLORS.danger,
      onPress: () => Linking.openURL("tel:18007624337"),
    },
    {
      id: 2,
      title: "Customer Service",
      value: "1-800-HELP-NOW",
      icon: "headset-mic",
      color: COLORS.info,
      onPress: () => Linking.openURL("tel:18004357666"),
    },
    {
      id: 3,
      title: "Email",
      value: "help@roadguard.com",
      icon: "email",
      color: COLORS.gray,
      onPress: () => Linking.openURL("mailto:help@roadguard.com"),
    },
    {
      id: 4,
      title: "Business Hours",
      value: "24/7",
      icon: "access-time",
      color: COLORS.success,
      onPress: () => {},
    },
  ];

  const faqItems = [
    {
      question: "How quickly can someone reach me?",
      answer: "Our average response time is under 30 minutes in urban areas.",
    },
    {
      question: "What areas do you service?",
      answer:
        "We service all major metropolitan areas and most rural locations nationwide.",
    },
    {
      question: "Do you work with my insurance?",
      answer:
        "We work with most major insurance providers. Contact us to verify your coverage.",
    },
    {
      question: "How does billing work?",
      answer:
        "We accept all major credit cards, and you can also pay through your insurance.",
    },
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      subject: !formData.subject ? "Subject is required" : "",
      message: !formData.message ? "Message is required" : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSendMessage = () => {
    if (!validateForm()) return;

    Alert.alert(
      "Message Sent",
      "Thank you for contacting us. We will get back to you as soon as possible.",
      [
        {
          text: "OK",
          onPress: () => {
            setFormData({ subject: "", message: "" });
          },
        },
      ]
    );
  };

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="contact-support" size={28} color={COLORS.white} />
          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>
        <Button
          title="Home"
          onPress={() => router.back()}
          variant="outline"
          style={styles.backButton}
          textStyle={styles.backButtonText}
          icon={<Icon name="home" size={16} color={COLORS.primaryLight} />}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>We're Here to Help</Text>
          <Text style={styles.heroSubtitle}>
            Get in touch with our support team for any questions or concerns.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Methods</Text>
          <View style={styles.contactMethods}>
            {contactMethods.map((method) => (
              <ContactMethod
                key={method.id}
                method={method}
                onPress={method.onPress}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.contactForm}>
            <Input
              label="Subject"
              placeholder="What is this regarding?"
              value={formData.subject}
              onChangeText={(value: string) => updateFormData("subject", value)}
              error={errors.subject}
              icon={<Icon name="subject" size={20} color={COLORS.primary} />}
            />

            <Input
              label="Message"
              placeholder="Type your message here..."
              value={formData.message}
              onChangeText={(value: string) => updateFormData("message", value)}
              error={errors.message}
              multiline
              numberOfLines={4}
              style={styles.messageInput}
              icon={<Icon name="message" size={20} color={COLORS.primary} />}
            />

            <Button
              title="Send Message"
              onPress={handleSendMessage}
              icon={
                <Icon
                  name="send"
                  size={20}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqItems.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <Button
                  title={faq.question}
                  onPress={() => toggleFaq(index)}
                  variant="outline"
                  style={styles.faqQuestion}
                  textStyle={styles.faqQuestionText}
                  icon={
                    <Icon
                      name={
                        expandedFaq === index ? "expand-less" : "expand-more"
                      }
                      size={20}
                      color={COLORS.gray}
                    />
                  }
                />
                {expandedFaq === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.officeInfo}>
          <Icon name="business" size={32} color={COLORS.primary} />
          <Text style={styles.officeTitle}>RoadGuard Headquarters</Text>
          <Text style={styles.officeAddress}>
            123 Assistance Drive{"\n"}
            Help City, HC 12345{"\n"}
            United States
          </Text>
          <Button
            title="Get Directions"
            onPress={() => Linking.openURL("https://maps.google.com")}
            variant="outline"
            style={styles.directionsButton}
            icon={<Icon name="directions" size={20} color={COLORS.primary} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.primaryLight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  contactMethods: {
    gap: 12,
  },
  contactForm: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  buttonIcon: {
    marginRight: 8,
  },
  faqList: {
    gap: 8,
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    overflow: "hidden",
  },
  faqQuestion: {
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 0,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "left",
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  faqAnswerText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  officeInfo: {
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  officeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  officeAddress: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  directionsButton: {
    minWidth: 200,
  },
});
