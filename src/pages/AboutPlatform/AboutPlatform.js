import React from 'react';
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import './AboutPlatformStyles.css';

const AboutPlatform = () => {
  // eslint-disable-next-line no-undef
  const ver = VERSION;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="caption" component="div" className="aboutPlatformVersion">
          Platform Version:
          {' '}
          {ver}
        </Typography>
      </Grid>
      <Grid container spacing={2} className="aboutPlatformAgreementContainer">
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5">
            Transparent Path spc
          </Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5">
            End User Agreement
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Welcome to the Transparent Path website, application and proprietary software platform that
            operates in connection with our proprietary sensors installed in commercial transport vehicles
            to track goods in transit at all times during the supply chain (collectively, the "Service") or
            otherwise made available to you as an authorized user of Transparent Path. The Service enables
            our customers, together with their authorized users ("Users," "you" or "your"), to better
            understand, manage and optimize transportation metrics and supply chain by using data from
            our proprietary sensors to generate and deliver utilization reports.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Every time users visit or use features of the Service, you agree to be bound by these Terms of
            Use ("Terms").  These Terms are in addition to any separate commercial agreement in place
            between Transparent Path and your employer.  These Terms outline your rights, obligations and
            restrictions regarding your use of the Service, please read them carefully. If you do not agree to
            be bound by the Terms and all applicable laws, you should discontinue use of the Service
            immediately. In the event of any conflict between these Terms and the commercial agreement
            you or your employee has in place with Transparent Path, the terms of the commercial
            agreement shall prevail.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Transparent Path may modify the Terms from time to time and each modification will be
            effective when it is posted on the Service. We will notify you of substantive modifications to
            these Terms the first time you access the Service following any such modification, and you agree
            to be bound to any changes to the Terms through your continued use of the Service.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            User Eligibility
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Each User hereby warrants that the User is either (a) an authorized employee, director, officer,
            agent or assign of a legitimate legal entity, or (b) an individual either more than 18 years of age,
            or an emancipated minor, or possess legal parental or guardian consent, and is fully able and
            competent to enter into the Terms, conditions, obligations, affirmations, representations, and
            warranties set forth in these Terms, and to abide by and comply with these Terms. In any case,
            the User affirms to be over the age of 13, as the Services are not intended for children under 13.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Accessing the Service
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Once your employer has a commercial agreement in place with us and provides us with access
            credential or other user identification criteria, you may be invited to log in and create an
            account with us or use the credentials provided to you to access your company profile. You may
            be requested to provide certain personal information such as your full name, Company name as
            the case may be, and email address to create your Account so you can use the Service and link
            to the sensors. Please refer to the commercial agreement between us and your company for
            information about how we protect personal information.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            You are responsible for ensuring that any personal information you provide is accurate and up
            to date. Transparent Path reserves the right to verify the accuracy of the information you
            provide at any time. You agree to notify Transparent Path immediately if you believe your user
            identification, password or other identifying information has been lost, stolen or otherwise
            compromised. You will be held responsible for any activity that occurs under your user
            credentials.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Guidelines, Fees, Rights and Remedies
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            The User acknowledges and agrees that:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List
            sx={{
              listStyleType: 'lower-alpha',
              listStylePosition: 'inside',
            }}
          >
            <ListItem sx={{ display: 'list-item' }}>
              all video, images, information, data, text, software, music, sound, photographs,
              messages or other materials collected, communicated or transmitted using the Services
              ("Content"), whether or not authorized by the User, are the sole responsibility of the User;
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              the User owns or has the necessary licenses, rights, consents, and permissions to use
              and authorizes Transparent Path to use all copyrights, trademarks, trade secrets, patents and
              other intellectual property or proprietary rights in and to any and all Content in accordance with
              these Terms; and
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              the User has the necessary consent, release and /or permission of each identifiable
              individual person in the Content to use the presence and likeness of each such individual in the
              Content in the manner contemplated by these Terms.
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            User grants Transparent Path a non-exclusive, worldwide, irrevocable, royalty-free, perpetual,
            sub-licensable and transferable license of all rights to use, edit, modify, include, incorporate,
            adapt, record, publicly perform, display, transmit and reproduce Content as required to provide,
            improve and enhance the Services. In addition, the User waives any so-called "moral rights" in
            and to the Content, to the extent permitted by applicable law.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Transparent Path reserves the right to purge Content from its databases at any time and from
            time to time without notice in accordance with its document retention policies. In addition,
            Transparent Path may disable User's account and access to use the Services and Transparent
            Path may recover from the User any losses, damages, costs or expenses incurred by Transparent
            Path resulting from or arising out of User's non-compliance with any provision of this
            Agreement.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            By submitting ideas, suggestions, documents, and/or proposals ("Contributions") to Transparent
            Path through its suggestion or feedback webpages, you acknowledge and agree that: (a) your
            Contributions do not contain confidential or proprietary information; (b) Transparent Path is not
            under any obligation of confidentiality, express or implied, with respect to the Contributions; (c)
            Transparent Path shall be entitled to use or disclose (or choose not to use or disclose) such
            Contributions for any purpose, in any way, in any media worldwide; (d) Transparent Path may
            have something similar to the Contributions already under consideration or in development; (e)
            your Contributions automatically become the property of Transparent Path without any
            obligation of Transparent Path to you; and (f) you are not entitled to any compensation or
            reimbursement of any kind from Transparent Path under any circumstances.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Permitted Use of the Service
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            You are responsible for any fees charged by your internet service provider or mobile carrier for
            using the Service, including, but not limited to data transfer fees.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" paragraph>
            You will be held solely responsible for your conduct on and use of the Service. You agree that
            you will not use or attempt to use this Service for any purpose other than to access reports
            generated from our proprietary sensors; you may not (and may not allow any third party to) use
            or attempt to use this Service or upload, download, post, submit or otherwise distribute or
            facilitate distribution of content on or through the Service for any purpose:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List
            sx={{
              listStyleType: 'disc',
              listStylePosition: 'inside',
            }}
          >
            <ListItem sx={{ display: 'list-item' }}>
              that infringes any patent, trademark, trade secret, copyright, right of publicity or other
              right of any other person or entity, or violates any law or contract;
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              that is any way unlawful or prohibited, or that is harmful, threatening, abusive,
              harassing, deceptive, fraudulent, offensive, obscene, profane, or otherwise destructive
              to anyone or their privacy or property;
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              that transmits any unauthorized or unsolicited advertisements, solicitations, schemes,
              spam, flooding, or other unsolicited spam or bulk e-mail (including without limited
              postings to third party social media services which are linked to the Service) or
              unsolicited commercial communications,
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              that transmits any harmful or disabling computer codes, files, programs or viruses;
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              that harvests e-mail addresses or personally identifiable information from Transparent Path,
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              that interferes with our network services or the proper working of the Service or
              activities conducted on the Service;
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              that uses manual or automated software or other processes to "crawl", "spider", index
              or in any non-transitory manner store or cache information obtained from any page of
              the Service;
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              that attempts to gain unauthorized access to our Service including bypassing measured
              we may use to prevent or restrict access to the Service (or other accounts, computer
              systems or networks connected to the Service);
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              that suggests an express or implied affiliation with Transparent Path (without the express
              written permission of Transparent Path) or that impersonates any person or entity
              including an employee or representative of Transparent Path; and
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              that impairs or limits our ability to operate this Service or any other person's ability to
              access and use this Service.
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Transparent Path reserves the right at all times and for any reason or for no reason at all, in its
            sole discretion and without notice to you, to deny your access to and use of this Service.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Intellectual Property Rights
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Transparent Path does not own any data or information that you submit in the course of
            creating your Account or any Content that is provided by you or collected from your use of the
            Service.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            We or our licensors own and retain all proprietary rights in the Service. The Service or any
            portion of the Service may not be reproduced, duplicated, copied, sold, resold, visited, or
            otherwise exploited for any commercial purpose without express written consent of
            Transparent Path, unless it is in the public domain. You may not frame or utilize framing
            techniques to enclose any trademark, logo, or other proprietary information (including images,
            text, page layout, or form) of Transparent Path without express written consent. You may not
            use any meta tags or any other "hidden text" utilizing Transparent Path's name or trademarks
            without the express written consent of Transparent Path. You may not (directly or indirectly)
            decipher, decompile, disassemble, reverse engineer or otherwise attempt to derive source code
            or underlying ideas or algorithms of any part of the Service, or modify, translate or otherwise
            create derivative works of any part of the Service. Any modification of content, or any portion
            thereof, or use of the content for any other purpose constitutes an infringement of trademark
            or other proprietary rights of Transparent Path or our third party service providers, and any
            unauthorized use terminates the permission to use the Service granted by Transparent Path.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Except for the Content, all content made available by Transparent Path to you on the Service,
            such as report formats, text, graphics, logos, button icons, images, audio clips, digital
            downloads, data compilations, and software, is the property of Transparent Path or its content/
            software suppliers and protected by United States and international copyright laws. All software
            used on our website and platform is the property of Transparent Path or its software suppliers
            and protected by United States and international copyright laws.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Linking to Third Party Websites
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            For your convenience, the Service may provide links to products or services, including payment
            processing services offered on other websites or applications. Unless expressly stated
            otherwise, Transparent Path does not endorse, approve, sponsor or control, and we are not in
            any way responsible for, any of the content, services, calculations, information, products, or
            materials available at or through any websites to which this Service may provide a link. By using
            the Service, you acknowledge and agree that Transparent Path will not be responsible or liable
            to you or any other person for any damages or claims that might result from your use of such
            content, services, calculation, information, products or materials. You should carefully review
            each website's privacy statements and conditions of use to understand your rights and
            responsibilities.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Disclaimer & Limitation of Liability
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            EXCEPT AS EXPRESSLY SET FORTH IN THESE TERMS OR THE APPLICABLE COMMERCIAL
            AGREEMENT, TRANSPARENT PATH MAKES NO FURTHER REPRESENTATIONS OR WARRANTIES OF
            ANY KIND WHATSOEVER, EXPRESS OR IMPLIED. TRANSPARENT PATH EXPRESSLY DISCLAIMS ALL
            IMPLIED WARRANTIES, WITHOUT LIMITATION, ANY IMPLIED WARRANTIES AS TO THE
            CONDITION, MERCHANTABILITYNON-INFRINGEMENT, DESIGN, OPERATION OR FITNESS FOR A
            PARTICULAR PURPOSE OF THE SERVICE. FOR AVOIDANCE OF DOUBT, THE DISCLAIMERS SET
            FORTH HEREIN DO NOT LIMIT ANY COVENANT, REPRESENTATION OR WARRANTY MADE BY
            TRANSPARENT PATH IN THIS AGREEMENT.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            YOU AGREE THAT UNDER NO CIRCUMSTANCES WILL TRANSPARENT PATH BE LIABLE TO YOU OR
            ANY OTHER PERSON OR ENTITY FOR ANY SPECIAL, INCIDENTAL, CONSEQUENTIAL, PUNITIVE OR
            OTHER INDIRECT DAMAGES THAT RESULT FROM THE USE OF, OR THE INABILITY TO USE, THE
            SERVICE, EVEN IF PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT
            SHALL THE TOTAL LIABILITY OF TRANSPARENT PATH TO YOU FOR ALL DAMAGES, LOSSES, AND
            CAUSES OF ACTION RESULTING FROM YOUR USE OF THE SERVICE, WHETHER IN CONTRACT,
            TORT (INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE) OR OTHERWISE, EXCEED THE AMOUNTS
            PAID BY YOU TO TRANSPARENT PATH IN THE IMMEDIATELY PRECEDING TWELVE-MONTH
            PERIOD.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            CERTAIN STATE LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE
            EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL
            OF THE ABOVE DISCLAIMERS, EXCLUSIONS, OR LIMITATIONS MAY NOT APPLY, AND YOU MIGHT
            HAVE ADDITIONAL RIGHTS.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Termination
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Transparent Path may terminate or suspend your access to all or part of the Service, for any
            reason, including without limitation your breach of these Terms. In the event these Terms are
            terminated, the representations and warranties, and limitations of liabilities set forth in these
            Terms will survive termination.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            Jurisdiction & Severability
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            Transparent Path operates the Service from its offices within the United States. You may not use
            the Service in violation of U.S. export laws and regulations.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            These Terms are not assignable, transferable, or sublicensable by you except with Transparent
            Path's prior written consent. Transparent Path may assign, transfer, or delegate any of its rights
            and obligations hereunder without consent.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            These Terms will be governed by and construed in accordance with the laws of the state of
            Washington without regard to its conflict of laws provisions. Any action brought against
            Transparent Path to enforce these Terms or matters related to the Service will be brought in
            either the state courts or, if there is exclusive federal jurisdiction, the federal courts of the state
            of Washington. Any claim or cause of action you have with respect to use of the Service must be
            commenced within one (1) year after the claim arises. In any action or proceeding to enforce
            rights under the Terms, the prevailing party will be entitled to recover costs and attorneys' fees.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            If any provision of these Terms is deemed void, unlawful, or otherwise unenforceable for any
            reason, that provision will be severed from these Terms and the remaining provisions of these
            Terms will remain in force. These Terms, together with the terms of any commercial agreement
            your employer has with us, constitute the entire agreement between you and Transparent Path
            concerning your use of the Service.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">
            How To Contact Us
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            {`Should you have any questions or complaints regarding violations of these Terms, please
            contact us via email at `}
            <Link
              color="primary"
              href="mailto:support@transparentpath.com"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              support@transparentpath.com
            </Link>
            {` or in writing at 1700 Westlake Ave N
            Suite 200, Seattle WA, USA, 98109.`}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AboutPlatform;
