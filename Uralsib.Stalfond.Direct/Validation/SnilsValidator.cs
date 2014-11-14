using System;
using System.Text.RegularExpressions;

namespace Uralsib.Stalfond.Direct.Validation
{
    public class SnilsValidator
    {
        public static bool IsValidSnils(string snils)
        {
            if (string.IsNullOrEmpty(snils) || (!string.IsNullOrEmpty(snils) && !new Regex(@"^\d{3}-\d{3}-\d{3} \d{2}$").IsMatch(snils)))
                return false;

            var chunks = snils.Replace("-", "").Split(new[] { ' ' });

            var number = int.Parse(chunks[0]);
            var checksum = int.Parse(chunks[1]);

            if (number > 001001998)
            {
                var sum = 0;

                for (int i = 1; i <= 9; i++)
                {
                    sum += int.Parse((String.Format("{0:000000000}", number))[9 - i].ToString()) * i;
                }

            resum:

                if (sum < 100)
                {
                    return checksum == sum;
                }
                if (sum == 100 || sum == 101)
                {
                    return checksum == 00;
                }
                if (sum > 101)
                {
                    sum = sum % 101;
                    goto resum;
                }
            }

            return true;
        }
    }
}
