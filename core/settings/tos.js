import React from 'react';
import {ScrollView, Text, Pressable} from 'react-native';
import styles from '../styles';

export default function TOS(toggleFunc) {
    return (
        <ScrollView
            style={styles.screenContainer}
        >
            <Text style={styles.heading}>Terms of Service</Text>

            <Text style={styles.marginTop}>
                Please read these terms and conditions carefully before using TRAK.
            </Text>

            <Text style={[styles.heading2, styles.marginTop]}>Interpretation</Text>

            <Text style={styles.marginTop}>
                The words of which the initial letter is capitalized have meanings
                defined under the following conditions. The following definitions
                shall have the same meaning regardless of whether they appear in
                singular or in plural.
            </Text>
            <Text style={styles.marginTop}>
                For the purposes of these Terms and Conditions:

                Application means the software program downloaded by You on any electronic device, named TRAK.

                Application Store means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded.

                Affiliate means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.

                Country refers to: Maharashtra, India.

                Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to TRAK.

                Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.

                Service refers to the Application.

                Terms and Conditions (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.

                Third-party Social Media Service means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.

                You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
            </Text>

            <Text style={[styles.heading2, styles.marginTop]}>"AS IS" and "AS AVAILABLE" Disclaimer</Text>
            <Text style={styles.marginTop}>
                The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.

                Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.

                Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.
            </Text>

            <Text style={{ padding: 20 }}></Text>
        </ScrollView>
    )
}